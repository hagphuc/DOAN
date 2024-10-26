// components/CartContext.js
import React, { createContext, useContext, useState } from 'react';

// Tạo context cho giỏ hàng
const CartContext = createContext();

// Provider cho giỏ hàng
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product, quantity = 1) => {
        setCartItems((prevItems) => {
            const existingProductIndex = prevItems.findIndex((item) => item._id === product._id);
    
            if (existingProductIndex !== -1) {
                const updatedItems = [...prevItems];
                updatedItems[existingProductIndex].quantity += quantity; // Cập nhật số lượng
                return updatedItems;
            } else {
                return [...prevItems, { ...product, quantity }]; // Thêm mới sản phẩm với số lượng
            }
        });
    
        // Thông báo thêm thành công
        alert(`${product.name} đã được thêm vào giỏ hàng!`);
    };
    
    const removeFromCart = (id) => {
        setCartItems((prevItems) => prevItems.filter(item => item._id !== id));
    };

    const updateQuantity = (id, quantity) => {
        if (quantity < 1) return; // Không cho phép số lượng dưới 1

        setCartItems((prevItems) => {
            return prevItems.map(item => {
                if (item._id === id) {
                    return { ...item, quantity }; // Cập nhật số lượng
                }
                return item;
            });
        });
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook để sử dụng CartContext
export const useCart = () => {
    return useContext(CartContext);
};
