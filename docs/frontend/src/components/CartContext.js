import React, { createContext, useContext, useState, useEffect } from 'react';

// Tạo context cho giỏ hàng
const CartContext = createContext();

// Provider cho giỏ hàng
export const CartProvider = ({ children }) => {
    // Tải dữ liệu từ local storage khi khởi động
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Hàm thêm sản phẩm vào giỏ hàng
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

    // Hàm xóa sản phẩm khỏi giỏ hàng
    const removeFromCart = (id) => {
        setCartItems((prevItems) => {
            const updatedItems = prevItems.filter(item => item._id !== id);
            localStorage.setItem('cartItems', JSON.stringify(updatedItems)); // Lưu vào local storage
            return updatedItems;
        });
    };

    // Hàm cập nhật số lượng sản phẩm trong giỏ hàng
    const updateQuantity = (id, quantity) => {
        if (quantity < 1) return; // Không cho phép số lượng dưới 1

        setCartItems((prevItems) => {
            const updatedItems = prevItems.map(item => {
                if (item._id === id) {
                    return { ...item, quantity }; // Cập nhật số lượng
                }
                return item;
            });
            localStorage.setItem('cartItems', JSON.stringify(updatedItems)); // Lưu vào local storage
            return updatedItems;
        });
    };

    // Hàm xóa giỏ hàng
    const clearCart = () => {
        setCartItems([]); // Xóa giỏ hàng khỏi state
        localStorage.removeItem('cartItems'); // Xóa giỏ hàng khỏi local storage
    };

    // Lưu giỏ hàng vào local storage khi cartItems thay đổi
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook để sử dụng CartContext
export const useCart = () => {
    return useContext(CartContext);
};
