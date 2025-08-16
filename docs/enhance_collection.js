// Enhanced Postman Collection - Complete API Documentation
// This script completes the professional-grade API documentation

const fs = require('fs');

// Read the current collection
const collection = JSON.parse(fs.readFileSync('./postman_collection.json', 'utf8'));

// Add remaining product endpoints to the Product Catalog Management section
const productSection = collection.item.find(item => item.name === '📦 Product Catalog Management');

// Add more product endpoints
productSection.item.push(
  {
    "name": "🔍 Search Products",
    "event": [
      {
        "listen": "test",
        "script": {
          "exec": [
            "// Test suite for product search",
            "pm.test('Search results status is 200', function () {",
            "    pm.response.to.have.status(200);",
            "});",
            "",
            "pm.test('Search returns relevant results', function () {",
            "    const response = pm.response.json();",
            "    pm.expect(response).to.have.property('rows');",
            "    pm.expect(response.rows).to.be.an('array');",
            "});",
            "",
            "pm.test('Search results contain query term', function () {",
            "    const response = pm.response.json();",
            "    const query = pm.request.url.query.get('q');",
            "    if (query && response.rows.length > 0) {",
            "        const firstProduct = response.rows[0];",
            "        pm.expect(firstProduct.name.toLowerCase()).to.include(query.toLowerCase());",
            "    }",
            "});",
            "",
            "if (pm.response.code === 200) {",
            "    const response = pm.response.json();",
            "    console.log('🔍 Search found', response.count, 'products');",
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
        "raw": "{{baseUrl}}/products?q=laptop&page=1&limit=10",
        "host": ["{{baseUrl}}"],
        "path": ["products"],
        "query": [
          {
            "key": "q",
            "value": "laptop",
            "description": "Search term for product name"
          },
          {
            "key": "page",
            "value": "1",
            "description": "Page number for pagination"
          },
          {
            "key": "limit",
            "value": "10",
            "description": "Number of results per page"
          }
        ]
      },
      "description": "### 🔍 Search Products\n\n**Purpose**: Performs full-text search across product catalog with advanced filtering options.\n\n**Business Logic**:\n- Searches product names using case-insensitive matching\n- Supports partial word matching and fuzzy search\n- Combines search with category and price filters\n- Returns paginated results for optimal performance\n- Highlights search relevance in results\n\n**Query Parameters**:\n- `q` (required): Search term for product names\n- `page` (optional): Page number, defaults to 1\n- `limit` (optional): Results per page, defaults to 10\n- `categoryId` (optional): Restrict search to specific category\n- `minPrice` & `maxPrice` (optional): Price range filters\n\n**Search Features**:\n- **Case Insensitive**: 'LAPTOP' matches 'laptop'\n- **Partial Matching**: 'lap' matches 'laptop'\n- **Multiple Terms**: 'wireless mouse' matches products with both words\n- **Category Filtering**: Search within specific categories\n- **Price Filtering**: Combine search with price ranges\n\n**Success Response** (200):\n```json\n{\n  \"count\": 8,\n  \"rows\": [\n    {\n      \"id\": 3,\n      \"name\": \"Gaming Laptop Pro\",\n      \"description\": \"High-performance gaming laptop with RTX graphics\",\n      \"price\": 1299.99,\n      \"stock\": 5,\n      \"relevanceScore\": 0.95,\n      \"category\": {\n        \"id\": 1,\n        \"name\": \"Computers\"\n      }\n    }\n  ]\n}\n```\n\n**Search Examples**:\n- Basic: `?q=laptop`\n- With category: `?q=gaming&categoryId=1`\n- With price range: `?q=wireless&minPrice=50&maxPrice=200`\n- Complex: `?q=bluetooth%20speaker&categoryId=2&minPrice=100&maxPrice=300&page=1&limit=5`\n\n**Performance Optimization**:\n- Database indexes on product names\n- Efficient LIKE queries with proper indexing\n- Result caching for popular search terms\n- Search analytics for improving relevance\n\n**Common Use Cases**:\n- **Product Discovery**: Users finding specific items\n- **Category Browsing**: Searching within categories\n- **Price Comparison**: Finding products in budget range\n- **Feature Search**: Looking for specific product features\n\n---"
    },
    "response": []
  },
  {
    "name": "👁️ Get Product Details",
    "event": [
      {
        "listen": "test",
        "script": {
          "exec": [
            "// Test suite for product details",
            "pm.test('Product details status is 200', function () {",
            "    pm.response.to.have.status(200);",
            "});",
            "",
            "pm.test('Product object contains all fields', function () {",
            "    const response = pm.response.json();",
            "    pm.expect(response).to.have.property('id');",
            "    pm.expect(response).to.have.property('name');",
            "    pm.expect(response).to.have.property('description');",
            "    pm.expect(response).to.have.property('price');",
            "    pm.expect(response).to.have.property('stock');",
            "    pm.expect(response).to.have.property('category');",
            "});",
            "",
            "pm.test('Category information is included', function () {",
            "    const response = pm.response.json();",
            "    pm.expect(response.category).to.have.property('id');",
            "    pm.expect(response.category).to.have.property('name');",
            "});",
            "",
            "pm.test('Price is valid number', function () {",
            "    const response = pm.response.json();",
            "    pm.expect(response.price).to.be.a('number');",
            "    pm.expect(response.price).to.be.greaterThan(0);",
            "});",
            "",
            "if (pm.response.code === 200) {",
            "    const response = pm.response.json();",
            "    console.log('✅ Product details loaded:', response.name);",
            "    console.log('💰 Price: $' + response.price);",
            "    console.log('📦 Stock: ' + response.stock + ' units');",
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
        "raw": "{{baseUrl}}/products/{{productId}}",
        "host": ["{{baseUrl}}"],
        "path": ["products", "{{productId}}"]
      },
      "description": "### 👁️ Get Product Details\n\n**Purpose**: Retrieves comprehensive information for a specific product including specifications, images, and availability.\n\n**Business Logic**:\n- Fetches complete product information by unique ID\n- Includes category details and related metadata\n- Provides real-time stock availability\n- Returns product images and specifications\n- No authentication required (public endpoint)\n\n**Path Parameters**:\n- `productId` (required): Unique identifier for the product\n\n**Success Response** (200):\n```json\n{\n  \"id\": 1,\n  \"name\": \"Premium Wireless Headphones\",\n  \"description\": \"Professional-grade wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality. Perfect for music enthusiasts and professionals.\",\n  \"price\": 299.99,\n  \"stock\": 15,\n  \"imageUrl\": \"https://example.com/products/headphones-premium.jpg\",\n  \"specifications\": {\n    \"brand\": \"AudioTech\",\n    \"color\": \"Matte Black\",\n    \"batteryLife\": \"30 hours\",\n    \"connectivity\": \"Bluetooth 5.0\",\n    \"features\": [\"Active Noise Cancellation\", \"Fast Charging\", \"Voice Assistant\"]\n  },\n  \"category\": {\n    \"id\": 2,\n    \"name\": \"Electronics\",\n    \"description\": \"Consumer electronics and gadgets\"\n  },\n  \"createdAt\": \"2025-08-15T10:00:00Z\",\n  \"updatedAt\": \"2025-08-15T10:00:00Z\"\n}\n```\n\n**Product Information Includes**:\n- **Basic Details**: Name, description, price, stock\n- **Images**: High-resolution product photos\n- **Specifications**: Technical details and features\n- **Category**: Product classification and category info\n- **Availability**: Real-time stock levels\n- **Metadata**: Creation and update timestamps\n\n**Common Errors**:\n- `404`: Product not found (invalid ID)\n- `500`: Server error retrieving product data\n\n**Use Cases**:\n- **Product Pages**: Detailed product information display\n- **Shopping Cart**: Verify product details before adding\n- **Inventory Check**: Real-time stock availability\n- **Price Comparison**: Current pricing information\n- **Product Specifications**: Technical details for comparison\n\n**Frontend Integration**:\n- Use for product detail pages\n- Real-time stock updates\n- Image gallery display\n- Specification tables\n- Add to cart functionality\n\n**Performance**:\n- Cached product data for faster loading\n- Optimized database queries\n- Image CDN integration\n- Mobile-optimized responses\n\n---"
    },
    "response": []
  }
);

// Add Shopping Cart Management section
collection.item.push({
  "name": "🛒 Shopping Cart Management",
  "description": "## Shopping Cart Management\n\n### Overview\nComprehensive shopping cart system supporting persistent cart storage, real-time inventory checking, and seamless checkout integration. Designed for optimal user experience across sessions.\n\n### Features\n- **Persistent Storage**: Cart contents saved across user sessions\n- **Real-time Updates**: Instant cart modifications with inventory validation\n- **Inventory Checking**: Automatic stock verification before operations\n- **Price Calculation**: Dynamic totals with tax and discount calculations\n- **Session Management**: User-specific cart isolation\n\n### Authentication\n- **Required**: All cart operations require valid authentication token\n- **User Isolation**: Each user has their own independent cart\n- **Session Persistence**: Cart survives login/logout cycles\n\n### Business Rules\n- Maximum quantity per item: 10 units\n- Stock validation on every cart operation\n- Automatic cart cleanup after 30 days of inactivity\n- Price updates reflect real-time product pricing\n\n---",
  "item": [
    {
      "name": "➕ Add Item to Cart",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "// Test suite for adding items to cart",
              "pm.test('Add to cart status is 201', function () {",
              "    pm.response.to.have.status(201);",
              "});",
              "",
              "pm.test('Cart item contains required fields', function () {",
              "    const response = pm.response.json();",
              "    pm.expect(response).to.have.property('id');",
              "    pm.expect(response).to.have.property('productId');",
              "    pm.expect(response).to.have.property('quantity');",
              "    pm.expect(response).to.have.property('price');",
              "});",
              "",
              "pm.test('Product information is included', function () {",
              "    const response = pm.response.json();",
              "    pm.expect(response).to.have.property('product');",
              "    pm.expect(response.product).to.have.property('name');",
              "});",
              "",
              "pm.test('Quantity matches request', function () {",
              "    const response = pm.response.json();",
              "    const requestBody = JSON.parse(pm.request.body.raw);",
              "    pm.expect(response.quantity).to.equal(requestBody.quantity);",
              "});",
              "",
              "if (pm.response.code === 201) {",
              "    const response = pm.response.json();",
              "    console.log('✅ Added to cart:', response.product.name);",
              "    console.log('📦 Quantity:', response.quantity);",
              "    console.log('💰 Unit price: $' + response.price);",
              "    pm.collectionVariables.set('cartItemId', response.id);",
              "}"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "auth": {
          "type": "bearer",
          "bearer": [
            {
              "key": "token",
              "value": "{{authToken}}",
              "type": "string"
            }
          ]
        },
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"productId\": {{productId}},\n  \"quantity\": 2\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "{{baseUrl}}/cart/items",
          "host": ["{{baseUrl}}"],
          "path": ["cart", "items"]
        },
        "description": "### ➕ Add Item to Cart\n\n**Purpose**: Adds a product to the user's shopping cart with specified quantity and automatic inventory validation.\n\n**Authentication**: Required - Valid JWT token\n\n**Business Logic**:\n- Validates product exists and is available\n- Checks sufficient stock for requested quantity\n- Updates existing cart item if product already in cart\n- Calculates real-time pricing and totals\n- Enforces maximum quantity limits per item\n\n**Request Requirements**:\n- `productId` (required): Valid product identifier\n- `quantity` (required): Number of items (1-10)\n\n**Success Response** (201):\n```json\n{\n  \"id\": 15,\n  \"productId\": 1,\n  \"quantity\": 2,\n  \"price\": 299.99,\n  \"subtotal\": 599.98,\n  \"product\": {\n    \"id\": 1,\n    \"name\": \"Premium Wireless Headphones\",\n    \"imageUrl\": \"https://example.com/headphones.jpg\",\n    \"stock\": 13\n  },\n  \"addedAt\": \"2025-08-15T10:45:00Z\"\n}\n```\n\n**Inventory Validation**:\n- **Stock Check**: Verifies sufficient inventory\n- **Real-time Updates**: Stock levels checked at operation time\n- **Reservation**: Items temporarily reserved during checkout\n- **Availability**: Out-of-stock items cannot be added\n\n**Quantity Rules**:\n- **Minimum**: 1 item\n- **Maximum**: 10 items per product\n- **Stock Limit**: Cannot exceed available inventory\n- **Update Logic**: Adding existing product updates quantity\n\n**Common Errors**:\n- `400`: Invalid product ID, quantity out of range\n- `401`: Authentication required\n- `404`: Product not found\n- `409`: Insufficient stock available\n- `422`: Quantity exceeds maximum allowed per item\n\n**Business Features**:\n- **Price Locking**: Cart items maintain price at time of addition\n- **Inventory Alerts**: Notifications when stock becomes limited\n- **Quantity Limits**: Prevents overselling and inventory issues\n- **Cart Persistence**: Items saved across user sessions\n\n**Integration Points**:\n- **Product Catalog**: Real-time product and pricing data\n- **Inventory System**: Stock level validation\n- **User Management**: Cart isolation per user\n- **Checkout Process**: Seamless transition to order creation\n\n---"
      },
      "response": []
    }
  ]
});

// Save the enhanced collection
fs.writeFileSync('./postman_collection.json', JSON.stringify(collection, null, 2));
console.log('✅ Enhanced Postman collection created successfully!');
console.log('📁 File: postman_collection.json');
console.log('🚀 Ready for import into Postman');
