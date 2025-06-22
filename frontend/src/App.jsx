import { Suspense } from 'react';
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
import { LoadingOverlay } from './components/custom/LoadingSkeletons';
import { ScrollToTop } from './components/custom/utils';

const roles = ['admin', 'orderManager', 'contentManager', 'customerSupport', 'productManager'];

const pageRoles = {
  orders: ['admin', 'orderManager'],

  faqs: ['admin', 'contentManager'],
  images: ['admin', 'contentManager'],

  reviews: ['admin', 'productManager'],
  products: ['admin', 'productManager', 'orderManager'],
  categories: ['admin', 'productManager'],
  subcategories: ['admin', 'productManager'],
  subSubcategories: ['admin', 'productManager'],
  productRestockSubscriptions: ['admin', 'productManager'],
  suppliers: ['admin', 'productManager'],
  contacts: ['admin', 'customerSupport'],
};

const getAllowedRoles = (name) => pageRoles[name] || ['admin'];

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
        <Route path="/category/:slug/" element={<ProductsByCategory />} />
        <Route path="/subcategory/:slug/" element={<ProductsBySubcategory />} />
        <Route path="/subSubcategory/:slug/" element={<ProductsBySubSubCategory />} />
        <Route path="/:slug" element={<ProductDetails />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/wishlist/:userId" element={<SharedWishlist />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/about-us" element={<AboutUs />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={roles}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {Object.entries(pages).map(([name, Page]) => (
            <Route
              key={name}
              path={name}
              element={
                <ProtectedRoute allowedRoles={getAllowedRoles(name)} >
                  <Page />
                </ProtectedRoute>
              }
            />
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
        <Route path="/not-found" element={<NotFound />} />
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