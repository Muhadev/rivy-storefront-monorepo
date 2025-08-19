apps/frontend/
├── .env
├── .env.docker
├── .env.example
├── .env.production
├── api-test.html
├── ARCHITECTURE.md
├── docker-compose.yml
├── Dockerfile
├── Dockerfile.dev
├── eslint.config.js
├── index.html
├── nginx.conf
├── nginx.dev.conf
├── package.json
├── postcss.config.js
├── README.docker.md
├── tailwind.config.js
├── tsconfig.json
├── vercel.json
├── vite.config.ts
├── vitest.config.ts
├── assests/
│   └── Screenshot (277).png
├── src/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── vite-env.d.ts
│   ├── __test__/
│   │   ├── setup.ts
│   │   └── utils/
│   │       ├── format.test.ts
│   │       └── ProductCard.test.tsx
│   ├── components/
│   │   ├── DiscountSection.tsx
│   │   ├── ReviewForm.tsx
│   │   ├── ReviewsList.tsx
│   │   ├── StarRating.tsx
│   │   ├── admin/
│   │   │   └── AdminLayout.tsx
│   │   ├── auth/
│   │   │   └── ProtectedRoute.tsx
│   │   ├── common/
│   │   │   ├── NotFound.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   └── ProductDetailsModal.tsx
<!-- │   │   ├── forms/
│   │   │   ├── CustomerForm.tsx
│   │   │   ├── DiscountForm.tsx
│   │   │   └── ProductForm.tsx -->
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   └── Header.tsx
<!-- │   │   ├── modals/
│   │   ├── product/
│   │   ├── sidebar/
│   │   ├── tables/ -->
│   │   └── ui/
│   │       ├── Badge.tsx
│   │       ├── Label.tsx
│   │       ├── Separator.tsx
│   │       ├── Textarea.tsx
│   │       └── ...
│   ├── config/
│   │   ├── admin.ts
│   │   ├── api.ts
<!-- │   │   ├── constants.ts -->
│   │   ├── fonts.ts
│   │   └── theme.ts
<!-- │   ├── context/
│   │   └── SecurityContext.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── ToastContext.tsx -->
<!-- │   ├── features/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── CustomersManagement.tsx
│   │   │   ├── DiscountsManagement.tsx
│   │   │   ├── OrdersManagement.tsx
│   │   │   └── ProductsManagement.tsx
│   │   ├── auth/
│   │   └── dashboard/ -->
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCategories.ts
│   │   ├── useCustomers.ts
│   │   ├── useDashboard.ts
│   │   ├── useDiscounts.ts
│   │   ├── useOrders.ts
│   │   └── useProducts.ts
│   ├── lib/
│   │   ├── api-client.ts
│   │   ├── http-client.ts
│   │   ├── utils.ts
│   │   └── repositories/
│   │       ├── admin.repository.ts
│   │       ├── auth.repository.ts
│   │       ├── cart.repository.ts
│   │       ├── discount.repository.ts
│   │       ├── order.repository.ts
│   │       ├── product.repository.ts
│   │       ├── review.repository.ts
│   │       └── user.repository.ts
│   ├── pages/
│   │   ├── Cart.tsx
│   │   ├── CartPage.tsx
│   │   ├── Catalog.tsx
│   │   ├── Checkout.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── Confirm.tsx
│   │   ├── HomePage.tsx
│   │   ├── NotFoundPage.tsx
│   │   ├── OrderDetailPage-new.tsx
│   │   ├── OrderDetailPage.tsx
│   │   ├── OrdersPage-new.tsx
│   │   ├── OrdersPage.tsx
│   │   ├── Product.tsx
│   │   ├── ProductsPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── admin/
│   │   │   ├── AdminCustomers.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminDiscountForm.tsx
│   │   │   ├── AdminDiscounts.tsx
│   │   │   ├── AdminOrders.tsx
│   │   │   ├── AdminProductForm.tsx
│   │   │   ├── AdminProducts.tsx
│   │   │   ├── AdminProfile.tsx
│   │   │   ├── AdminReviewForm.tsx
│   │   │   ├── AdminReviews.tsx
│   │   │   └── ProductRepository.ts
│   │   ├── auth/
│   ├── repositories/
│   │   ├── admin.repository.ts
│   │   ├── auth.repository.ts
│   │   ├── cart.repository.ts
│   │   ├── discount.repository.ts
│   │   ├── order.repository.ts
│   │   ├── product.repository.ts
│   │   ├── review.repository.ts
│   │   └── user.repository.ts
│   ├── stores/
│   │   ├── auth.store.ts
│   │   ├── authStore.ts
│   │   ├── cart.store.ts
│   │   ├── cartStore.ts
│   │   ├── discount.store.ts
│   │   ├── order.store.ts
│   │   ├── review.store.ts
│   │   └── user.store.ts
│   ├── types/
│   │   ├── api.ts
<!-- │   │   ├── index.ts -->
│   │   └── order.ts
│   ├── ui/
│   │   ├── Badge.tsx
│   │   ├── Label.tsx
│   │   ├── Separator.tsx
│   │   ├── Textarea.tsx
│   │   └── ...
│   └── utils/
│       ├── cn.ts
│       ├── format.ts

Endpoint
GET /api/v1/customers

Query Parameters
search (optional): string — filter by name or email
page (optional): number — page number (default: 1)
limit (optional): number — items per page (default: 10)
Example Request:
GET /api/v1/customers?search=john&page=2&limit=10

Response Structure

{
  "customers": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2025-08-19T12:34:56.000Z"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "createdAt": "2025-08-18T09:21:45.000Z"
    }
    // ...more customers
  ],
  "pagination": {
    "page": 2,
    "limit": 10,
    "total": 37,
    "pages": 4
  }
}