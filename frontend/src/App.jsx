import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import pages from './assets/dashboardPages.js';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import Addresses from './components/Profile/AddressInformation.jsx';
import Orders from './components/Profile/Orders.jsx';
import Profile from './components/Profile/ProfileInformation.jsx';
import Reviews from './components/Profile/Reviews.jsx';
import Wishlist from './components/Profile/Wishlist.jsx';
import ProtectedRoute from './components/Route/ProtectedRoute';
import PublicRoute from './components/Route/PublicRoute';
import ToTop from './components/ToTop';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import FAQs from './pages/FAQs.jsx';
import Home from './pages/Home';
import NotAllowed from './pages/NotAllowed';
import NotFound from './pages/NotFound.jsx';
import Cart from './pages/Product/Cart.jsx';
import ProductDetails from './pages/Product/ProductDetails.jsx';
import ProductsByCategory from './pages/Product/ProductsByCategory.jsx';
import ProductsBySubcategory from './pages/Product/ProductsBySubcategory.jsx';
import ProductsBySubSubCategory from './pages/Product/ProductsBySubSubCategory.jsx';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

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

      <Route path="*" element={<NotFound />} />
      <Route path="/faqs" element={<FAQs />} />
      <Route path="/not-allowed" element={<NotAllowed />} />
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