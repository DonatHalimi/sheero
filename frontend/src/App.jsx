import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import pages from './assets/dashboardPages.js';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/Route/ProtectedRoute';
import PublicRoute from './components/Route/PublicRoute';
import ToTop from './components/ToTop';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

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
      <Route path="*" element={<NotFound />} />
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