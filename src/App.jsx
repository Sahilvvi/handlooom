import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductList from './pages/admin/ProductList';
import AddProduct from './pages/admin/AddProduct';
import { About, Shipping, Returns, Privacy, Faq, Career, Contact, OurStores } from './pages/StaticPages';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Shopper Routes */}
            <Route path="/" element={<><Header /><Home /><Footer /></>} />
            <Route path="/shop" element={<><Header /><Shop /><Footer /></>} />
            <Route path="/shop/:category" element={<><Header /><Shop /><Footer /></>} />
            <Route path="/product/:id" element={<><Header /><ProductDetail /><Footer /></>} />
            <Route path="/checkout" element={<><Header /><Checkout /><Footer /></>} />
            <Route path="/login" element={<><Header /><Login /><Footer /></>} />
            <Route path="/about" element={<><Header /><About /><Footer /></>} />
            <Route path="/shipping" element={<><Header /><Shipping /><Footer /></>} />
            <Route path="/returns" element={<><Header /><Returns /><Footer /></>} />
            <Route path="/privacy" element={<><Header /><Privacy /><Footer /></>} />
            <Route path="/faq" element={<><Header /><Faq /><Footer /></>} />
            <Route path="/career" element={<><Header /><Career /><Footer /></>} />
            <Route path="/contact" element={<><Header /><Contact /><Footer /></>} />
            <Route path="/stores" element={<><Header /><OurStores /><Footer /></>} />

            {/* Admin Routes */}
            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<ProductList />} />
                <Route path="products/new" element={<AddProduct />} />
                <Route path="products/edit/:id" element={<AddProduct />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
