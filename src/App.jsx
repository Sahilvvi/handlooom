import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Cart from './pages/Cart';
import Account from './pages/Account';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductList from './pages/admin/ProductList';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';
import OrderManagement from './pages/admin/OrderManagement';
import { About, Shipping, Returns, Privacy, Faq, Career, Contact, OurStores } from './pages/StaticPages';
import './App.css';

const Layout = ({ children }) => <><Header />{children}<Footer /></>;

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/shop" element={<Layout><Shop /></Layout>} />
              <Route path="/shop/:category" element={<Layout><Shop /></Layout>} />
              <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
              <Route path="/cart" element={<Layout><Cart /></Layout>} />
              <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
              <Route path="/login" element={<Layout><Login /></Layout>} />
              <Route path="/signup" element={<Layout><Signup /></Layout>} />
              <Route path="/account" element={<Layout><Account /></Layout>} />

              {/* Static Pages */}
              <Route path="/about" element={<Layout><About /></Layout>} />
              <Route path="/shipping" element={<Layout><Shipping /></Layout>} />
              <Route path="/returns" element={<Layout><Returns /></Layout>} />
              <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
              <Route path="/faq" element={<Layout><Faq /></Layout>} />
              <Route path="/career" element={<Layout><Career /></Layout>} />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />
              <Route path="/stores" element={<Layout><OurStores /></Layout>} />

              {/* Admin Routes */}
              <Route element={<ProtectedRoute adminOnly={true} />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="products" element={<ProductList />} />
                  <Route path="products/new" element={<AddProduct />} />
                  <Route path="products/edit/:id" element={<EditProduct />} />
                  <Route path="orders" element={<OrderManagement />} />
                </Route>
              </Route>
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
