import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductDetail.css';
import Header from './Header';
import { useCart } from '../components/CartContext'; // Import CartContext

const ProductDetail = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [allProducts, setAllProducts] = useState([]);

    const { addToCart } = useCart(); // Sử dụng CartContext

    useEffect(() => {
        const fetchProductDetail = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/api/products/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProduct(response.data);
                setError('');
            } catch (err) {
                console.error('Lỗi khi lấy thông tin sản phẩm:', err);
                setError('Lỗi khi lấy thông tin sản phẩm. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        const fetchAllProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/products', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setAllProducts(response.data);
            } catch (err) {
                console.error('Lỗi khi lấy danh sách sản phẩm:', err);
            }
        };

        fetchProductDetail();
        fetchAllProducts();
    }, [productId]);

    const handleAddToCart = (e) => {
        e.preventDefault(); // Ngăn chặn việc gửi form nếu nút nằm trong một form
        if (product) {
            addToCart(product, quantity); // Sử dụng addToCart từ CartContext với số lượng hiện tại
        }
    };
    

    const handleQuantityChange = (e) => {
        const value = Math.max(1, parseInt(e.target.value, 10));
        setQuantity(value);
    };

    const incrementQuantity = () => {
        setQuantity((prevQuantity) => prevQuantity + 1);
    };

    const decrementQuantity = () => {
        setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    };

    const handleImageClick = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const showPreviousProduct = () => {
        const currentIndex = allProducts.findIndex(p => p._id === productId);
        const previousIndex = (currentIndex - 1 + allProducts.length) % allProducts.length;
        const previousProductId = allProducts[previousIndex]._id;
        navigate(`/products/${previousProductId}`);
    };

    const showNextProduct = () => {
        const currentIndex = allProducts.findIndex(p => p._id === productId);
        const nextIndex = (currentIndex + 1) % allProducts.length;
        const nextProductId = allProducts[nextIndex]._id;
        navigate(`/products/${nextProductId}`);
    };

    if (loading) return <p>Đang tải thông tin sản phẩm...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!product) return <p>Sản phẩm không tồn tại!</p>;

    return (
        <div className="product-detail">
            <Header />
            <div className="detail-container">
                <div className="image-container">
                    {product.imageUrl && (
                        <img 
                            src={`http://localhost:5000/${product.imageUrl}`} 
                            alt={product.name} 
                            className="product-image" 
                            onClick={handleImageClick} 
                        />
                    )}
                </div>
                <div className="info-container">
                    <h1>{product.name}</h1>
                    <p><strong>Mô tả:</strong> {product.description}</p>
                    <p className="price"><strong>Giá:</strong> {product.price} VNĐ</p>
                    <div className="quantity-selector">
                        <label htmlFor="quantity">Số lượng:</label>
                        <button className="quantity-button" onClick={decrementQuantity}>-</button>
                        <input 
                            type="number" 
                            id="quantity" 
                            value={quantity} 
                            onChange={handleQuantityChange} 
                            min="1" 
                        />
                        <button className="quantity-button" onClick={incrementQuantity}>+</button>
                    </div>
                    <button onClick={handleAddToCart} className="add-to-cart">Thêm vào giỏ hàng</button>
                </div>
            </div>
            
            {isModalOpen && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <img 
                            src={`http://localhost:5000/${product.imageUrl}`} 
                            alt={product.name} 
                            className="modal-image" 
                        />
                        <div className="modal-navigation-icons">
                            <button onClick={showPreviousProduct} disabled={allProducts.length <= 1} className="nav-icon nav-icon-left">
                                &lt;
                            </button>
                            <button onClick={showNextProduct} disabled={allProducts.length <= 1} className="nav-icon nav-icon-right">
                                &gt;
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
