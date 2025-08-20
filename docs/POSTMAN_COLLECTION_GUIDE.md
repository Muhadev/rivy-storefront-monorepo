# Rivy Storefront API - Professional Postman Collection

## **Collection Overview**

This is a **Postman collection** designed by for comprehensive API testing and documentation. Created for both technical and non-technical stakeholders.

---

## **Collection Structure**

### **7 Main Sections | 21 Endpoints Total**

#### **Authentication & User Management** (5 endpoints)
- **Customer Registration**: Create customer accounts with standard privileges
- ** Admin Registration**: Create administrative accounts with elevated access
- **User Login**: Authenticate users and obtain access tokens
- **Forgot Password**: Initiate secure password reset process
- **Reset Password**: Complete password reset with validation

#### **Product Catalog Management** (3 endpoints)
- **List All Products**: Browse products with pagination and filtering
- ** Search Products**: Advanced product search with multiple criteria
- **Get Product Details**: Comprehensive product information retrieval

#### **Shopping Cart Management** (4 endpoints)
- **Add Item to Cart**: Add products with inventory validation
- **View Cart Contents**: Display cart with calculated totals
- **Update Cart Item**: Modify quantities with stock checking
- **Remove Item from Cart**: Remove items from shopping cart

#### **Order Management** (3 endpoints)
- ** Checkout Process**: Convert cart to order with payment simulation
- **Get Order Details**: Retrieve comprehensive order information
- **List User Orders**: Display user's order history with pagination

#### **User Profile Management** (2 endpoints)
- **Get User Profile**: Retrieve current user's profile information
- **Update User Profile**: Modify user account details

####  **Admin Operations** (3 endpoints)
- **Create Product (Admin)**: Add new products to catalog
- **Update Product (Admin)**: Modify existing product information
- **Delete Product (Admin)**: Remove products from catalog

#### **System Health & Utilities** (1 endpoint)
- **Health Check**: Verify system availability and database connectivity

---

## ** Features**

### **Documentation Quality**
- **Business Logic Descriptions**: Clear explanation of each endpoint's purpose
- **Request/Response Examples**: Comprehensive JSON examples with actual data
- **Error Handling**: Detailed error codes and troubleshooting guidance
- **Authentication Flows**: Step-by-step auth process documentation
- **Use Case Scenarios**: Real-world application examples

### **Testing Excellence**
- **Automated Test Suites**: 70+ individual test assertions
- **Response Validation**: Comprehensive response structure verification
- **Token Management**: Automatic token extraction and variable handling
- **Error Detection**: Intelligent error reporting and debugging
- **Variable Automation**: Smart collection variable management

### **Engineering Mindset**
- **Role-Based Testing**: Separate admin and customer authentication flows
- **Security Validation**: Token validation, password security, data exposure checks
- **Performance Monitoring**: Response time validation and optimization checks
- **Data Integrity**: Input validation and business rule enforcement
- **Production Readiness**: Real-world scenarios and edge case handling

---

## **Quick Start Guide**

### **1. Import Collection**
1. Open Postman Desktop App
2. Click **"Import"** → **"Upload Files"**
3. Select `rivy_professional_api_collection.json` from Desktop
4. Click **"Import"**

### **2. Setup Environment**
1. Create new environment: `Rivy Storefront API`
2. Add variables:
   ```
   baseUrl: http://localhost:4000/api/v1
   authToken: (leave empty - auto-populated)
   adminToken: (leave empty - auto-populated)
   ```

### **3. Start Backend Server**
```bash
cd rivy-storefront-monorepo/apps/backend
npm run dev
```

### **4. Testing Workflow**

#### **For Customer Operations:**
1. **Authentication** → **Customer Registration**
2. **Product Catalog** → **List All Products**
3. **Shopping Cart** → **Add Item to Cart**
4. **Order Management** → **Checkout Process**

#### **For Admin Operations:**
1. **Authentication** → **Admin Registration**
2. **Admin Operations** → **Create Product**
3. **Admin Operations** → **Update Product**

---

## **Test Results & Examples**

### **After Each Request, Save Response as Example:**

1. **Run Request** → Wait for response
2. **Click "Save Response"** → **"Save as Example"**
3. **Name Example**: `Success - [Description]` or `Error - [Error Type]`
4. **Add Description**: Brief explanation of the scenario

**Example Names:**
- `Success - Customer Registration with Token`
- `Success - Product Search Results`
- `Error - Invalid Credentials Login`
- `Error - Insufficient Stock Add to Cart`

---

## **Advanced Configuration**

### **Collection Variables** (Auto-managed)
```json
{
  "baseUrl": "http://localhost:4000/api/v1",
  "authToken": "auto-populated-from-login",
  "adminToken": "auto-populated-from-admin-login",
  "userId": "auto-populated-user-id",
  "productId": "auto-populated-product-id",
  "orderId": "auto-populated-order-id"
}
```

### **Global Scripts**
- **Pre-request**: Automatic request logging and token validation
- **Test**: Response time validation and error detection
- **Console Output**: Detailed operation feedback and debugging info

---

## **User Roles & Permissions**

### **Customer Role**
- Product browsing and search
- Shopping cart management
- Order creation and tracking
- Profile management
- Product administration
- User management

### **Admin Role**
- All customer permissions
- Product CRUD operations
- Category management
- User oversight
- System administration

---

## **Business Logic Coverage**

### **E-commerce Operations**
- **Inventory Management**: Stock validation and reservation
- **Price Calculations**: Tax, shipping, and discount application
- **Order Processing**: Complete order lifecycle management
- **User Management**: Registration, authentication, and profile handling

### **Security Features**
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Customer and admin permission enforcement
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: Protection against abuse and attacks

### **Performance Optimization**
- **Pagination**: Efficient large dataset handling
- **Search Optimization**: Fast product discovery
- **Cache Strategies**: Optimized response times
- **Database Efficiency**: Optimized queries and indexing

---

## **Perfect For**

- **API Documentation**: Convert to comprehensive API docs
- **Team Onboarding**: New developer quick-start guide
- **Client Integration**: Third-party developer resources
- **Quality Assurance**: Comprehensive testing scenarios
- **Production Testing**: Live API validation and monitoring
- **Stakeholder Demos**: Non-technical stakeholder presentations

---

**Created by**: Muhadev  
**Version**: 1.0  
**Last Updated**: August 2025  
**Compatibility**: Postman v10+ | Newman CLI | Postman Web**
