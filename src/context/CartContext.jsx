import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const saved = localStorage.getItem('jannat_cart');
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });

    useEffect(() => {
        localStorage.setItem('jannat_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        setCartItems(prev => {
            const existing = prev.find(i => i._id === product._id);
            if (existing) {
                return prev.map(i => i._id === product._id
                    ? { ...i, quantity: i.quantity + quantity }
                    : i
                );
            }
            return [...prev, { ...product, quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(i => i._id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) { removeFromCart(productId); return; }
        setCartItems(prev => prev.map(i => i._id === productId ? { ...i, quantity } : i));
    };

    const clearCart = () => setCartItems([]);

    const cartTotal = cartItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
