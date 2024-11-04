import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useCart } from './CartContext';
import Header from './Header';
import './Cart.css';
import axios from 'axios';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity } = useCart();
    const [deletingId, setDeletingId] = useState(null);
    const [isOrdering, setIsOrdering] = useState(false);
    const [orderModalOpen, setOrderModalOpen] = useState(false);
    const [orderInfo, setOrderInfo] = useState({ name: '', phone: '', email: '', address: '' });
    const [orderStatus, setOrderStatus] = useState({ success: null, message: '' });
    const [nameError, setNameError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);


    useEffect(() => {
        if (orderStatus.success !== null) {
            const timer = setTimeout(() => {
                setOrderStatus({ success: null, message: '' });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [orderStatus]);

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + (item.price * item.quantity || 0), 0);
    };

    const handleRemoveFromCart = (id) => {
        setDeletingId(id);
        setTimeout(() => {
            removeFromCart(id);
        }, 1000);
    };

    const handleOrder = () => {
        setOrderModalOpen(true);
    };

    const handleConfirmOrder = async () => {
        // Reset error messages
        setNameError('');
        setPhoneError('');
    
        let hasError = false;
    
        // Validate inputs
        if (!orderInfo.name.trim()) {
            setNameError('Tên người dùng là bắt buộc.');
            hasError = true;
        }
    
        if (!orderInfo.phone.trim()) {
            setPhoneError('Số điện thoại là bắt buộc.');
            hasError = true;
        }
    
        if (hasError) return;
    
        setIsOrdering(true);
    
        const orderData = {
            items: cartItems.map(item => ({
                productId: item._id,
                quantity: item.quantity
            })),
            totalAmount: calculateTotal(),
            customerInfo: orderInfo,
        };
    
        try {
            const response = await axios.post('http://localhost:5000/api/orders', orderData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
    
            if (response.data.success) {
                setOrderStatus({ success: true, message: 'Đặt hàng thành công!' });
                setOrderInfo({ name: '', phone: '', email: '', address: '' });
                setSelectedProducts([]); // Reset selected products after successful order

                // Close the modal immediately after a successful order
                setOrderModalOpen(false);
    
                setTimeout(() => {
                    setOrderStatus({ success: null, message: '' });
                }, 5000);
            } else {
                setOrderStatus({ success: false, message: response.data.message || 'Đặt hàng thất bại. Vui lòng thử lại.' });
            }
        } catch (error) {
            console.error('Order error:', error.response || error);
            setOrderStatus({ success: false, message: 'Đã xảy ra lỗi. Vui lòng thử lại sau.' });
        } finally {
            setIsOrdering(false);
        }
    };
    const handleProductSelectionChange = (e, productName) => {
        const { checked } = e.target;
        if (checked) {
            setSelectedProducts(prev => [...prev, productName]);
        } else {
            setSelectedProducts(prev => prev.filter(product => product !== productName));
        }
    };

    const handleRemoveSelectedProducts = () => {
        selectedProducts.forEach(productName => {
            const itemToRemove = cartItems.find(item => item.name === productName);
            if (itemToRemove) {
                removeFromCart(itemToRemove._id);
            }
        });
        setSelectedProducts([]); // Clear selection after removal
    };
    
    return (
        <div>
            <Header />
            <h1>Giỏ Hàng</h1>
            {cartItems.length === 0 ? (
                <div>Giỏ hàng của bạn đang trống.</div>
            ) : (
                <div>
                    <table className="cart-table">
                        <thead>
                            <tr>
                                <th>Chọn</th> {/* New column for selection */}
                                <th>Sản phẩm</th>
                                <th>Giá</th>
                                <th>Số lượng</th>
                                <th>Tổng</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map(item => (
                                <tr key={item._id} className={deletingId === item._id ? 'delete-animation' : ''}>
                                    <td>
                                        <input 
                                            type="checkbox" 
                                            id={`select-${item._id}`} 
                                            value={item.name} 
                                            checked={selectedProducts.includes(item.name)}
                                            onChange={(e) => handleProductSelectionChange(e, item.name)}
                                        />
                                    </td>
                                    <td className="cart-item">
                                        {item.imageUrl && (
                                            <img 
                                                src={`http://localhost:5000/${item.imageUrl}`} 
                                                alt={item.name} 
                                                className="cart-item-image" 
                                            />
                                        )}
                                        <span className="cart-item-name">{item.name}</span>
                                    </td>
                                    <td className="cart-item-price">{item.price.toLocaleString()} VNĐ</td>
                                    <td>
                                        <div className="quantity-control">
                                            <button onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                                        </div>
                                    </td>
                                    <td>{(item.price * item.quantity).toLocaleString()} VNĐ</td>
                                    <td>
                                        <button className="delete-button" onClick={() => handleRemoveFromCart(item._id)}>
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h2>Tổng cộng: {calculateTotal().toLocaleString()} VNĐ</h2>
                    
                    <button 
                        className="order-button" 
                        onClick={handleOrder} 
                        disabled={isOrdering}
                    >
                        Đặt hàng
                    </button>
                    <button 
                        className="remove-selected-button" 
                        onClick={handleRemoveSelectedProducts}
                        disabled={selectedProducts.length === 0} // Disable if no product is selected
                    >
                        Xóa tất cả sản phẩm đã chọn
                    </button>

                    {orderModalOpen && (
                        <div className="modal-overlay" onClick={() => setOrderModalOpen(false)}>
                            <div className="order-modal" onClick={(e) => e.stopPropagation()}>
                                <h2>Thông tin đặt hàng</h2>
                                <p>Vui lòng điền thông tin bên dưới để xác nhận đơn hàng của bạn.</p>
                                <div className="order-details">
                                    <div className="customer-info">
                                        <div>
                                            <label>Tên người dùng: <span style={{ color: 'red' }}>*</span></label>
                                            <input
                                                type="text"
                                                value={orderInfo.name}
                                                onChange={(e) => setOrderInfo({ ...orderInfo, name: e.target.value })}
                                            />
                                            {nameError && <div style={{ color: 'red' }}>{nameError}</div>} 
                                        </div>
                                        <div>
                                            <label>Số điện thoại: <span style={{ color: 'red' }}>*</span></label>
                                            <input
                                                type="text"
                                                value={orderInfo.phone}
                                                onChange={(e) => setOrderInfo({ ...orderInfo, phone: e.target.value })}
                                            />
                                            {phoneError && <div style={{ color: 'red' }}>{phoneError}</div>} 
                                        </div>
                                        <div>
                                            <label>Email:</label>
                                            <input
                                                type="email"
                                                value={orderInfo.email}
                                                onChange={(e) => setOrderInfo({ ...orderInfo, email: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label>Địa chỉ:</label>
                                            <input
                                                type="text"
                                                value={orderInfo.address}
                                                onChange={(e) => setOrderInfo({ ...orderInfo, address: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="cart-summary">
                                        <h3>Sản phẩm trong giỏ hàng</h3>
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
                                                    <span>{item.name} - {item.price.toLocaleString()} VNĐ (x{item.quantity})</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <h2>Tổng cộng: {calculateTotal().toLocaleString()} VNĐ</h2>
                                    </div>
                                </div>
                                <div className="order-modal-buttons">
                                    <button onClick={handleConfirmOrder} disabled={isOrdering}>
                                        {isOrdering ? 'Đang đặt hàng...' : 'Xác nhận đặt hàng'}
                                    </button>
                                    <button onClick={() => setOrderModalOpen(false)}>Hủy</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {orderStatus.message && (
                        <div className={`order-status-popup ${orderStatus.success ? 'success' : 'error'}`}>
                            {orderStatus.message}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Cart;
