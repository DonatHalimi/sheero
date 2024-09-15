import {
  Addresses,
  Cart,
  DashboardLayout,
  FAQs,
  Home,
  Login,
  NotAllowed,
  NotFound,
  Orders,
  ProductDetails,
  ProductsByCategory,
  ProductsBySubcategory,
  ProductsBySubSubCategory,
  Profile,
  ProtectedRoute,
  PublicRoute,
  React,
  Register,
  Reviews,
  Route,
  Router,
  Routes,
  SharedWishlist,
  ToastContainer,
  ToTop,
  Wishlist,
  SearchResults
} from './assets/imports';

import pages from './assets/dashboardPages';

const App = () => (
  <Router>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/faqs" element={<FAQs />} />
      <Route path="/not-allowed" element={<NotAllowed />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute adminOnly><DashboardLayout /></ProtectedRoute>}>
        {Object.entries(pages).map(([name, Page]) => (
          <Route key={name} path={name} element={<ProtectedRoute adminOnly><Page /></ProtectedRoute>} />
        ))}
      </Route>
      <Route path="/products/category/:id/" element={<ProductsByCategory />} />
      <Route path="/products/subcategory/:id/" element={<ProductsBySubcategory />} />
      <Route path="/products/subSubcategory/:id/" element={<ProductsBySubSubCategory />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/addresses" element={<ProtectedRoute><Addresses /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
      <Route path="/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
      <Route path="/search-results" element={<SearchResults />} />

      {/* Public route to view shared wishlist */}
      <Route path="/wishlist/:userId" element={<SharedWishlist />} />

      {/* Fallback Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>

    <ToastContainer
      position="bottom-right"
      autoClose={3500}
      closeOnClick
      hideProgressBar={true}
      newestOnTop
      stacked
    />

    <ToTop />
  </Router>
);

export default App;