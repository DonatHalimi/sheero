import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import pages from './assets/dashboardPages.js';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import ProtectedRoute from './components/Route/ProtectedRoute';
import PublicRoute from './components/Route/PublicRoute';
import ToTop from './components/ToTop';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import FAQs from './pages/FAQs.jsx';
import Home from './pages/Home';
import NotFound from './pages/NotFound.jsx';
import ProductDetails from './pages/Product/ProductDetails.jsx';
import ProductsByCategory from './pages/Product/ProductsByCategory.jsx';
import ProductsBySubcategory from './pages/Product/ProductsBySubcategory.jsx';
import ProductsBySubSubCategory from './pages/Product/ProductsBySubSubCategory.jsx';
import NotAllowed from './pages/NotAllowed';

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

      <Route path="*" element={<NotFound />} />
      <Route path="/faqs" element={<FAQs />} />
      <Route path="/not-allowed" element={<NotAllowed />} />
    </Routes>
    <ToastContainer
      position="bottom-right"
      closeOnClick
      hideProgressBar={true}
      stacked
    />
    <ToTop />
  </Router>
);

export default App;
