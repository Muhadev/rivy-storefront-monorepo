// Complete Professional Postman Collection Builder
// Adds all remaining endpoints with senior-level documentation

const fs = require('fs');

// Read the current collection
const collection = JSON.parse(fs.readFileSync('./postman_collection.json', 'utf8'));

// Add all remaining cart endpoints to Shopping Cart section
const cartSection = collection.item.find(item => item.name === '🛒 Shopping Cart Management');

cartSection.item.push(
  {
    "name": "📋 View Cart Contents",
    "event": [
      {
        "listen": "test",
        "script": {
          "exec": [
            "pm.test('Cart view status is 200', function () {",
            "    pm.response.to.have.status(200);",
            "});",
            "",
            "pm.test('Cart contains items array', function () {",
            "    const response = pm.response.json();",
            "    pm.expect(response).to.have.property('items');",
            "    pm.expect(response.items).to.be.an('array');",
            "});",
            "",
            "pm.test('Cart totals are calculated', function () {",
            "    const response = pm.response.json();",
            "    pm.expect(response).to.have.property('subtotal');",
            "    pm.expect(response).to.have.property('tax');",
            "    pm.expect(response).to.have.property('total');",
            "});",
            "",
            "if (pm.response.code === 200) {",
            "    const response = pm.response.json();",
            "    console.log('🛒 Cart contains', response.items.length, 'items');",
            "    console.log('💰 Total: $' + response.total);",
            "}"
          ],
          "type": "text/javascript"
        }
      }
    ],
    "request": {
      "auth": {
        "type": "bearer",
        "bearer": [{"key": "token", "value": "{{authToken}}", "type": "string"}]
      },
      "method": "GET",
      "header": [],
      "url": {
        "raw": "{{baseUrl}}/cart",
        "host": ["{{baseUrl}}"],
        "path": ["cart"]
      },
      "description": "### 📋 View Cart Contents\n\n**Purpose**: Retrieves the complete cart contents with item details, quantities, and calculated totals.\n\n**Authentication**: Required - Valid JWT token\n\n**Business Logic**:\n- Displays all items currently in user's cart\n- Calculates subtotal, tax, and final total\n- Includes real-time product information\n- Shows current availability for each item\n- Applies any active discounts or promotions\n\n**Success Response** (200):\n```json\n{\n  \"items\": [\n    {\n      \"id\": 15,\n      \"productId\": 1,\n      \"quantity\": 2,\n      \"price\": 299.99,\n      \"subtotal\": 599.98,\n      \"product\": {\n        \"id\": 1,\n        \"name\": \"Premium Wireless Headphones\",\n        \"imageUrl\": \"https://example.com/headphones.jpg\",\n        \"stock\": 13\n      }\n    }\n  ],\n  \"summary\": {\n    \"itemCount\": 2,\n    \"subtotal\": 599.98,\n    \"tax\": 30.00,\n    \"shipping\": 0.00,\n    \"discount\": 0.00,\n    \"total\": 629.98\n  },\n  \"updatedAt\": \"2025-08-15T10:45:00Z\"\n}\n```\n\n**Cart Features**:\n- **Real-time Pricing**: Current product prices\n- **Stock Validation**: Available quantity for each item\n- **Tax Calculation**: Automatic tax computation\n- **Discount Application**: Active promotions applied\n- **Shipping Estimates**: Delivery cost calculations\n\n---"
    },
    "response": []
  },
  {
    "name": "✏️ Update Cart Item",
    "event": [
      {
        "listen": "test",
        "script": {
          "exec": [
            "pm.test('Cart update status is 200', function () {",
            "    pm.response.to.have.status(200);",
            "});",
            "",
            "pm.test('Updated quantity is correct', function () {",
            "    const response = pm.response.json();",
            "    const requestBody = JSON.parse(pm.request.body.raw);",
            "    pm.expect(response.quantity).to.equal(requestBody.quantity);",
            "});",
            "",
            "if (pm.response.code === 200) {",
            "    const response = pm.response.json();",
            "    console.log('✅ Cart item updated');",
            "    console.log('📦 New quantity:', response.quantity);",
            "}"
          ],
          "type": "text/javascript"
        }
      }
    ],
    "request": {
      "auth": {
        "type": "bearer",
        "bearer": [{"key": "token", "value": "{{authToken}}", "type": "string"}]
      },
      "method": "PUT",
      "header": [{"key": "Content-Type", "value": "application/json"}],
      "body": {
        "mode": "raw",
        "raw": "{\n  \"quantity\": 3\n}",
        "options": {"raw": {"language": "json"}}
      },
      "url": {
        "raw": "{{baseUrl}}/cart/items/{{cartItemId}}",
        "host": ["{{baseUrl}}"],
        "path": ["cart", "items", "{{cartItemId}}"]
      },
      "description": "### ✏️ Update Cart Item\n\n**Purpose**: Modifies the quantity of an existing cart item with inventory validation.\n\n**Authentication**: Required - Valid JWT token\n\n**Path Parameters**:\n- `cartItemId` (required): ID of the cart item to update\n\n**Request Body**:\n- `quantity` (required): New quantity (1-10)\n\n**Business Logic**:\n- Validates new quantity against available stock\n- Updates cart item quantity and recalculates totals\n- Enforces quantity limits and business rules\n- Maintains product pricing and availability\n\n**Success Response** (200):\n```json\n{\n  \"id\": 15,\n  \"productId\": 1,\n  \"quantity\": 3,\n  \"price\": 299.99,\n  \"subtotal\": 899.97,\n  \"updatedAt\": \"2025-08-15T10:50:00Z\"\n}\n```\n\n---"
    },
    "response": []
  },
  {
    "name": "🗑️ Remove Item from Cart",
    "event": [
      {
        "listen": "test",
        "script": {
          "exec": [
            "pm.test('Item removal status is 204', function () {",
            "    pm.response.to.have.status(204);",
            "});",
            "",
            "if (pm.response.code === 204) {",
            "    console.log('✅ Item removed from cart successfully');",
            "}"
          ],
          "type": "text/javascript"
        }
      }
    ],
    "request": {
      "auth": {
        "type": "bearer",
        "bearer": [{"key": "token", "value": "{{authToken}}", "type": "string"}]
      },
      "method": "DELETE",
      "header": [],
      "url": {
        "raw": "{{baseUrl}}/cart/items/{{cartItemId}}",
        "host": ["{{baseUrl}}"],
        "path": ["cart", "items", "{{cartItemId}}"]
      },
      "description": "### 🗑️ Remove Item from Cart\n\n**Purpose**: Completely removes a specific item from the user's shopping cart.\n\n**Authentication**: Required - Valid JWT token\n\n**Path Parameters**:\n- `cartItemId` (required): ID of the cart item to remove\n\n**Business Logic**:\n- Removes the specified cart item completely\n- Releases any inventory reservations\n- Recalculates cart totals automatically\n- Updates cart timestamps\n\n**Success Response** (204): No content - item successfully removed\n\n**Common Errors**:\n- `401`: Authentication required\n- `404`: Cart item not found or doesn't belong to user\n- `500`: Server error during removal\n\n---"
    },
    "response": []
  }
);

// Add Order Management section
collection.item.push({
  "name": "📦 Order Management",
  "description": "## Order Management\n\n### Overview\nComprehensive order processing system handling the complete order lifecycle from creation to fulfillment. Supports order tracking, status updates, and customer order history.\n\n### Order States\n- **Pending**: Order created, awaiting payment processing\n- **Processing**: Payment confirmed, preparing for shipment\n- **Shipped**: Order dispatched, tracking information available\n- **Delivered**: Order successfully delivered to customer\n- **Cancelled**: Order cancelled before shipment\n\n### Features\n- **Order Creation**: Convert cart contents to orders\n- **Status Tracking**: Real-time order status updates\n- **Order History**: Complete customer order records\n- **Inventory Management**: Automatic stock adjustments\n- **Payment Integration**: Simulated payment processing\n\n---",
  "item": [
    {
      "name": "🛍️ Checkout Process",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Checkout status is 201', function () {",
              "    pm.response.to.have.status(201);",
              "});",
              "",
              "pm.test('Order object is created', function () {",
              "    const response = pm.response.json();",
              "    pm.expect(response).to.have.property('order');",
              "    pm.expect(response.order).to.have.property('id');",
              "    pm.expect(response.order).to.have.property('status');",
              "});",
              "",
              "pm.test('Order contains items', function () {",
              "    const response = pm.response.json();",
              "    pm.expect(response.order).to.have.property('items');",
              "    pm.expect(response.order.items).to.be.an('array');",
              "});",
              "",
              "if (pm.response.code === 201) {",
              "    const response = pm.response.json();",
              "    pm.collectionVariables.set('orderId', response.order.id);",
              "    console.log('✅ Order created successfully');",
              "    console.log('📋 Order ID:', response.order.id);",
              "    console.log('💰 Total: $' + response.order.total);",
              "}"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "auth": {
          "type": "bearer",
          "bearer": [{"key": "token", "value": "{{authToken}}", "type": "string"}]
        },
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"address\": \"123 Main Street, City, State 12345\"\n}",
          "options": {"raw": {"language": "json"}}
        },
        "url": {
          "raw": "{{baseUrl}}/checkout",
          "host": ["{{baseUrl}}"],
          "path": ["checkout"]
        },
        "description": "### 🛍️ Checkout Process\n\n**Purpose**: Converts shopping cart contents into a confirmed order with payment processing simulation.\n\n**Authentication**: Required - Valid JWT token\n\n**Business Logic**:\n- Validates cart contents and inventory availability\n- Reserves inventory for ordered items\n- Calculates final totals including tax and shipping\n- Creates order record with 'pending' status\n- Clears the shopping cart after successful order creation\n- Simulates payment processing for demo purposes\n\n**Request Requirements**:\n- `address` (required): Shipping address for the order\n\n**Success Response** (201):\n```json\n{\n  \"order\": {\n    \"id\": 42,\n    \"status\": \"pending\",\n    \"total\": 629.98,\n    \"subtotal\": 599.98,\n    \"tax\": 30.00,\n    \"shipping\": 0.00,\n    \"address\": \"123 Main Street, City, State 12345\",\n    \"items\": [\n      {\n        \"id\": 1,\n        \"productId\": 1,\n        \"productName\": \"Premium Wireless Headphones\",\n        \"quantity\": 2,\n        \"price\": 299.99,\n        \"subtotal\": 599.98\n      }\n    ],\n    \"createdAt\": \"2025-08-15T11:00:00Z\",\n    \"estimatedDelivery\": \"2025-08-22T11:00:00Z\"\n  },\n  \"message\": \"Order created successfully. Payment processing initiated.\"\n}\n```\n\n**Checkout Process**:\n1. **Cart Validation**: Verify cart has items and stock availability\n2. **Inventory Reservation**: Reserve ordered quantities\n3. **Price Calculation**: Calculate totals with current pricing\n4. **Order Creation**: Generate order record with unique ID\n5. **Payment Simulation**: Process payment (demo mode)\n6. **Cart Cleanup**: Clear cart contents after successful order\n7. **Confirmation**: Send order confirmation details\n\n---"
      },
      "response": []
    },
    {
      "name": "📋 Get Order Details",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Order details status is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Order contains required information', function () {",
              "    const response = pm.response.json();",
              "    pm.expect(response).to.have.property('id');",
              "    pm.expect(response).to.have.property('status');",
              "    pm.expect(response).to.have.property('items');",
              "    pm.expect(response).to.have.property('total');",
              "});",
              "",
              "if (pm.response.code === 200) {",
              "    const response = pm.response.json();",
              "    console.log('📋 Order ID:', response.id);",
              "    console.log('📊 Status:', response.status);",
              "    console.log('💰 Total: $' + response.total);",
              "}"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "auth": {
          "type": "bearer",
          "bearer": [{"key": "token", "value": "{{authToken}}", "type": "string"}]
        },
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/orders/{{orderId}}",
          "host": ["{{baseUrl}}"],
          "path": ["orders", "{{orderId}}"]
        },
        "description": "### 📋 Get Order Details\n\n**Purpose**: Retrieves comprehensive information for a specific order including items, status, and tracking details.\n\n**Authentication**: Required - Valid JWT token\n\n**Authorization**: Users can only access their own orders\n\n**Path Parameters**:\n- `orderId` (required): Unique identifier for the order\n\n**Success Response** (200):\n```json\n{\n  \"id\": 42,\n  \"status\": \"processing\",\n  \"total\": 629.98,\n  \"subtotal\": 599.98,\n  \"tax\": 30.00,\n  \"shipping\": 0.00,\n  \"address\": \"123 Main Street, City, State 12345\",\n  \"items\": [\n    {\n      \"id\": 1,\n      \"productId\": 1,\n      \"productName\": \"Premium Wireless Headphones\",\n      \"quantity\": 2,\n      \"price\": 299.99,\n      \"subtotal\": 599.98,\n      \"product\": {\n        \"imageUrl\": \"https://example.com/headphones.jpg\"\n      }\n    }\n  ],\n  \"createdAt\": \"2025-08-15T11:00:00Z\",\n  \"updatedAt\": \"2025-08-15T11:15:00Z\",\n  \"estimatedDelivery\": \"2025-08-22T11:00:00Z\",\n  \"trackingNumber\": \"TRK123456789\"\n}\n```\n\n---"
      },
      "response": []
    },
    {
      "name": "📝 List User Orders",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Orders list status is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Response contains orders array', function () {",
              "    const response = pm.response.json();",
              "    pm.expect(response).to.have.property('orders');",
              "    pm.expect(response.orders).to.be.an('array');",
              "});",
              "",
              "if (pm.response.code === 200) {",
              "    const response = pm.response.json();",
              "    console.log('📦 Found', response.orders.length, 'orders');",
              "}"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "auth": {
          "type": "bearer",
          "bearer": [{"key": "token", "value": "{{authToken}}", "type": "string"}]
        },
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/orders",
          "host": ["{{baseUrl}}"],
          "path": ["orders"]
        },
        "description": "### 📝 List User Orders\n\n**Purpose**: Retrieves paginated list of all orders for the authenticated user.\n\n**Authentication**: Required - Valid JWT token\n\n**Authorization**: Users see only their own orders\n\n**Success Response** (200):\n```json\n{\n  \"orders\": [\n    {\n      \"id\": 42,\n      \"status\": \"processing\",\n      \"total\": 629.98,\n      \"itemCount\": 2,\n      \"createdAt\": \"2025-08-15T11:00:00Z\",\n      \"estimatedDelivery\": \"2025-08-22T11:00:00Z\"\n    }\n  ],\n  \"pagination\": {\n    \"page\": 1,\n    \"limit\": 10,\n    \"total\": 1\n  }\n}\n```\n\n---"
      },
      "response": []
    }
  ]
});

// Add User Profile Management section
collection.item.push({
  "name": "👤 User Profile Management",
  "description": "## User Profile Management\n\n### Overview\nUser profile management system allowing customers to view and update their personal information, manage account settings, and handle account lifecycle operations.\n\n### Features\n- **Profile Viewing**: Access current user information\n- **Profile Updates**: Modify name, email, and other details\n- **Account Security**: Password management and security settings\n- **Account Deletion**: Self-service account closure\n\n---",
  "item": [
    {
      "name": "👁️ Get User Profile",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Profile status is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Profile contains user data', function () {",
              "    const response = pm.response.json();",
              "    pm.expect(response).to.have.property('id');",
              "    pm.expect(response).to.have.property('email');",
              "    pm.expect(response).to.have.property('role');",
              "});",
              "",
              "pm.test('Password is not exposed', function () {",
              "    const response = pm.response.json();",
              "    pm.expect(response).to.not.have.property('password');",
              "});",
              "",
              "if (pm.response.code === 200) {",
              "    const response = pm.response.json();",
              "    console.log('👤 User:', response.email);",
              "    console.log('🎭 Role:', response.role);",
              "}"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "auth": {
          "type": "bearer",
          "bearer": [{"key": "token", "value": "{{authToken}}", "type": "string"}]
        },
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/users/me",
          "host": ["{{baseUrl}}"],
          "path": ["users", "me"]
        },
        "description": "### 👁️ Get User Profile\n\n**Purpose**: Retrieves the current user's profile information and account details.\n\n**Authentication**: Required - Valid JWT token\n\n**Success Response** (200):\n```json\n{\n  \"id\": 1,\n  \"email\": \"customer@example.com\",\n  \"name\": \"John Customer\",\n  \"role\": \"customer\",\n  \"createdAt\": \"2025-08-15T10:30:00Z\",\n  \"updatedAt\": \"2025-08-15T10:30:00Z\"\n}\n```\n\n---"
      },
      "response": []
    },
    {
      "name": "✏️ Update User Profile",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Profile update status is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Updated fields are reflected', function () {",
              "    const response = pm.response.json();",
              "    const requestBody = JSON.parse(pm.request.body.raw);",
              "    if (requestBody.name) {",
              "        pm.expect(response.name).to.equal(requestBody.name);",
              "    }",
              "});",
              "",
              "if (pm.response.code === 200) {",
              "    console.log('✅ Profile updated successfully');",
              "}"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "auth": {
          "type": "bearer",
          "bearer": [{"key": "token", "value": "{{authToken}}", "type": "string"}]
        },
        "method": "PUT",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"John Updated Customer\"\n}",
          "options": {"raw": {"language": "json"}}
        },
        "url": {
          "raw": "{{baseUrl}}/users/me",
          "host": ["{{baseUrl}}"],
          "path": ["users", "me"]
        },
        "description": "### ✏️ Update User Profile\n\n**Purpose**: Updates the current user's profile information with new details.\n\n**Authentication**: Required - Valid JWT token\n\n**Request Body** (optional fields):\n- `name`: Display name for the user\n- `email`: Email address (must be unique)\n\n**Success Response** (200):\n```json\n{\n  \"id\": 1,\n  \"email\": \"customer@example.com\",\n  \"name\": \"John Updated Customer\",\n  \"role\": \"customer\",\n  \"updatedAt\": \"2025-08-15T11:30:00Z\"\n}\n```\n\n---"
      },
      "response": []
    }
  ]
});

// Add Admin Operations section
collection.item.push({
  "name": "🛡️ Admin Operations",
  "description": "## Admin Operations\n\n### Overview\nAdministrative endpoints for system management, product catalog administration, and user oversight. Restricted to users with admin role.\n\n### Access Control\n- **Admin Only**: All endpoints require admin role\n- **JWT Authentication**: Valid admin token required\n- **Audit Logging**: All admin actions are logged\n\n### Features\n- **Product Management**: Create, update, delete products\n- **Category Management**: Organize product categories\n- **User Management**: Oversee user accounts\n- **System Analytics**: Access system metrics and reports\n\n---",
  "item": [
    {
      "name": "➕ Create Product (Admin)",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Product creation status is 201', function () {",
              "    pm.response.to.have.status(201);",
              "});",
              "",
              "pm.test('Created product contains required fields', function () {",
              "    const response = pm.response.json();",
              "    pm.expect(response).to.have.property('id');",
              "    pm.expect(response).to.have.property('name');",
              "    pm.expect(response).to.have.property('price');",
              "});",
              "",
              "if (pm.response.code === 201) {",
              "    const response = pm.response.json();",
              "    console.log('✅ Product created:', response.name);",
              "    console.log('🆔 Product ID:', response.id);",
              "    pm.collectionVariables.set('newProductId', response.id);",
              "}"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "auth": {
          "type": "bearer",
          "bearer": [{"key": "token", "value": "{{adminToken}}", "type": "string"}]
        },
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"New Gaming Mouse\",\n  \"description\": \"High-precision gaming mouse with RGB lighting\",\n  \"price\": 79.99,\n  \"stock\": 50,\n  \"categoryId\": 2,\n  \"imageUrl\": \"https://example.com/gaming-mouse.jpg\"\n}",
          "options": {"raw": {"language": "json"}}
        },
        "url": {
          "raw": "{{baseUrl}}/products",
          "host": ["{{baseUrl}}"],
          "path": ["products"]
        },
        "description": "### ➕ Create Product (Admin)\n\n**Purpose**: Creates a new product in the catalog with full product information.\n\n**Authentication**: Required - Valid admin JWT token\n**Authorization**: Admin role required\n\n**Request Requirements**:\n- `name` (required): Product name\n- `description` (required): Product description\n- `price` (required): Product price (positive number)\n- `stock` (required): Initial inventory count\n- `categoryId` (required): Valid category ID\n- `imageUrl` (optional): Product image URL\n\n**Success Response** (201):\n```json\n{\n  \"id\": 6,\n  \"name\": \"New Gaming Mouse\",\n  \"description\": \"High-precision gaming mouse with RGB lighting\",\n  \"price\": 79.99,\n  \"stock\": 50,\n  \"categoryId\": 2,\n  \"imageUrl\": \"https://example.com/gaming-mouse.jpg\",\n  \"createdAt\": \"2025-08-15T12:00:00Z\",\n  \"updatedAt\": \"2025-08-15T12:00:00Z\"\n}\n```\n\n---"
      },
      "response": []
    },
    {
      "name": "✏️ Update Product (Admin)",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Product update status is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "if (pm.response.code === 200) {",
              "    console.log('✅ Product updated successfully');",
              "}"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "auth": {
          "type": "bearer",
          "bearer": [{"key": "token", "value": "{{adminToken}}", "type": "string"}]
        },
        "method": "PUT",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Updated Gaming Mouse Pro\",\n  \"price\": 89.99,\n  \"stock\": 45\n}",
          "options": {"raw": {"language": "json"}}
        },
        "url": {
          "raw": "{{baseUrl}}/products/{{newProductId}}",
          "host": ["{{baseUrl}}"],
          "path": ["products", "{{newProductId}}"]
        },
        "description": "### ✏️ Update Product (Admin)\n\n**Purpose**: Updates existing product information including pricing, inventory, and details.\n\n**Authentication**: Required - Valid admin JWT token\n**Authorization**: Admin role required\n\n**Path Parameters**:\n- `productId` (required): ID of the product to update\n\n**Request Body** (all fields optional):\n- `name`: Updated product name\n- `description`: Updated description\n- `price`: New price\n- `stock`: Updated inventory count\n- `categoryId`: New category assignment\n- `imageUrl`: Updated image URL\n\n---"
      },
      "response": []
    },
    {
      "name": "🗑️ Delete Product (Admin)",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Product deletion status is 204', function () {",
              "    pm.response.to.have.status(204);",
              "});",
              "",
              "if (pm.response.code === 204) {",
              "    console.log('✅ Product deleted successfully');",
              "}"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "auth": {
          "type": "bearer",
          "bearer": [{"key": "token", "value": "{{adminToken}}", "type": "string"}]
        },
        "method": "DELETE",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/products/{{newProductId}}",
          "host": ["{{baseUrl}}"],
          "path": ["products", "{{newProductId}}"]
        },
        "description": "### 🗑️ Delete Product (Admin)\n\n**Purpose**: Permanently removes a product from the catalog.\n\n**Authentication**: Required - Valid admin JWT token\n**Authorization**: Admin role required\n\n**Path Parameters**:\n- `productId` (required): ID of the product to delete\n\n**Success Response** (204): No content - product successfully deleted\n\n**Important Notes**:\n- This action is irreversible\n- Products in active orders cannot be deleted\n- Consider deactivating instead of deleting\n\n---"
      },
      "response": []
    }
  ]
});

// Add System Health section
collection.item.push({
  "name": "🏥 System Health & Utilities",
  "description": "## System Health & Utilities\n\n### Overview\nSystem monitoring, health checks, and utility endpoints for application status verification and debugging.\n\n### Features\n- **Health Monitoring**: API availability and database connectivity\n- **API Documentation**: OpenAPI specification access\n- **System Status**: Real-time system metrics\n\n---",
  "item": [
    {
      "name": "💓 Health Check",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Health check status is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('System is healthy', function () {",
              "    const response = pm.response.json();",
              "    pm.expect(response).to.have.property('status', 'ok');",
              "});",
              "",
              "pm.test('Database is connected', function () {",
              "    const response = pm.response.json();",
              "    pm.expect(response.database).to.equal('connected');",
              "});",
              "",
              "if (pm.response.code === 200) {",
              "    console.log('✅ System is healthy');",
              "    console.log('🕐 Uptime:', pm.response.json().uptime);",
              "}"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/health",
          "host": ["{{baseUrl}}"],
          "path": ["health"]
        },
        "description": "### 💓 Health Check\n\n**Purpose**: Verifies API availability, database connectivity, and overall system health.\n\n**Authentication**: None required (public endpoint)\n\n**Success Response** (200):\n```json\n{\n  \"status\": \"ok\",\n  \"timestamp\": \"2025-08-15T12:30:00Z\",\n  \"uptime\": \"2h 15m 30s\",\n  \"database\": \"connected\",\n  \"version\": \"1.0.0\",\n  \"environment\": \"development\"\n}\n```\n\n**Use Cases**:\n- **Load Balancer**: Health check endpoint\n- **Monitoring**: System availability verification\n- **Debugging**: Quick system status verification\n- **DevOps**: Automated health monitoring\n\n---"
      },
      "response": []
    }
  ]
});

// Save the complete enhanced collection
fs.writeFileSync('./postman_collection.json', JSON.stringify(collection, null, 2));

console.log('🎉 COMPLETE Professional Postman Collection Created!');
console.log('');
console.log('📊 Collection Statistics:');
console.log('- Total Sections:', collection.item.length);
let totalEndpoints = 0;
collection.item.forEach(section => {
  console.log(`  - ${section.name}: ${section.item.length} endpoints`);
  totalEndpoints += section.item.length;
});
console.log('- Total Endpoints:', totalEndpoints);
console.log('');
console.log('✨ Features Included:');
console.log('- Professional documentation for technical and non-technical users');
console.log('- Comprehensive test suites for each endpoint');
console.log('- Automatic token management and variable handling');
console.log('- Admin and customer role separation');
console.log('- Real-world business logic descriptions');
console.log('- Error handling and response examples');
console.log('- Performance and security considerations');
console.log('');
console.log('🚀 Ready for:');
console.log('- Import into Postman');
console.log('- API documentation generation');
console.log('- Team collaboration');
console.log('- Client onboarding');
console.log('- Production API testing');
