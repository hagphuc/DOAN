import React from 'react';
import { useCart } from './CartContext';
import Header from './Header';
import './Cart.css'; // Thêm CSS nếu cần để định dạng giỏ hàng

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity } = useCart(); // Cập nhật để sử dụng updateQuantity

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => {
            return acc + (item.price * item.quantity || 0);
        }, 0);
    };

    return (
        <div>
            <Header />
            <h1>Giỏ Hàng</h1>
            <ul>
                {cartItems.map(item => (
                    <li key={item._id} className="cart-item">
                        {item.imageUrl && (
                            <img 
                                src={`http://localhost:5000/${item.imageUrl}`} 
                                alt={item.name} 
                                className="cart-item-image" 
                            />
                        )}
                        <span>{item.name} - {item.price.toLocaleString()} VNĐ</span>
                        <div className="quantity-control">
                            <button onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                            <span>x{item.quantity}</span>
                            <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                        </div>
                        <button onClick={() => removeFromCart(item._id)}>Xóa</button>
                    </li>
                ))}
            </ul>
            <h2>Tổng cộng: {calculateTotal().toLocaleString()} VNĐ</h2>
        </div>
    );
};

export default Cart;