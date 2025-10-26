import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';

import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ForgotPassword from './components/Auth/ForgotPassword';
import FarmerDashboard from './components/Dashboard/FarmerDashboard';
import ProcessorDashboard from './components/Dashboard/ProcessorDashboard';
import CustomerDashboard from './components/Dashboard/CustomerDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import MarketplaceHome from './components/Marketplace/MarketplaceHome';
import ProductDetails from './components/Products/ProductDetails';
import ProductUpload from './components/Products/ProductUpload';
import Cart from './components/Cart/Cart';
import Wishlist from './components/Cart/Wishlist';
import Checkout from './components/Cart/Checkout';
import MilletBenefits from './components/Education/MilletBenefits';
import Quiz from './components/Education/Quiz';
import Recipes from './components/Education/Recipes';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/marketplace" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <CartProvider>
            <div className="App">
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Navigate to="/marketplace" />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/marketplace" element={<MarketplaceHome />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/benefits" element={<MilletBenefits />} />
                  <Route path="/quiz" element={<Quiz />} />
                  <Route path="/recipes" element={<Recipes />} />

                  <Route
                    path="/farmer/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['farmer']}>
                        <FarmerDashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/processor/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['processor']}>
                        <ProcessorDashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/customer/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['customer']}>
                        <CustomerDashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/upload-product"
                    element={
                      <ProtectedRoute allowedRoles={['farmer', 'processor']}>
                        <ProductUpload />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/cart"
                    element={
                      <ProtectedRoute>
                        <Cart />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/wishlist"
                    element={
                      <ProtectedRoute>
                        <Wishlist />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="*" element={<Navigate to="/marketplace" />} />
                </Routes>
              </main>
              <Footer />
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </div>
          </CartProvider>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;