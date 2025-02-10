import React, { Suspense } from 'react';
import { LoadingOverlay, ScrollToTop } from './assets/CustomComponents';
import pages from './assets/dashboardPages';
import {
  AboutUs,
  Addresses,
  Cart,
  ContactUs,
  DashboardLayout,
  FAQs,
  Home,
  Login,
  NotAllowed,
  NotFound,
  OrderDetails,
  Orders,
  OTPVerification,
  ProductDetails,
  ProductsByCategory,
  ProductsBySubcategory,
  ProductsBySubSubCategory,
  Profile,
  ProtectedRoute,
  PublicRoute,
  Register,
  ResetPassword,
  ReturnDetails,
  Returns,
  Reviews,
  Route,
  Router,
  Routes,
  SearchResults,
  SharedWishlist,
  ToastContainer,
  ToTop,
  Verify,
  Wishlist,
} from './assets/imports';

const App = () => (
  <Router>
    <ScrollToTop />
    <Suspense fallback={<LoadingOverlay />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path='/verify-otp' element={<OTPVerification />} />
        <Route path="/reset-password/:token" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/not-allowed" element={<NotAllowed />} />
        <Route path="/category/:id/" element={<ProductsByCategory />} />
        <Route path="/subcategory/:id/" element={<ProductsBySubcategory />} />
        <Route path="/subSubcategory/:id/" element={<ProductsBySubSubCategory />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/wishlist/:userId" element={<SharedWishlist />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/about-us" element={<AboutUs />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute adminOnly><DashboardLayout /></ProtectedRoute>}>
          {Object.entries(pages).map(([name, Page]) => (
            <Route key={name} path={name} element={<ProtectedRoute adminOnly><Page /></ProtectedRoute>} />
          ))}
        </Route>
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/profile/me" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/profile/address" element={<ProtectedRoute><Addresses /></ProtectedRoute>} />
        <Route path="/profile/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/profile/orders/:orderId" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
        <Route path="/profile/returns/:returnId" element={<ProtectedRoute><ReturnDetails /></ProtectedRoute>} />
        <Route path="/profile/returns" element={<ProtectedRoute><Returns /></ProtectedRoute>} />
        <Route path="/profile/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/profile/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
        <Route path="/verify" element={<ProtectedRoute><Verify /></ProtectedRoute>} />

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>

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