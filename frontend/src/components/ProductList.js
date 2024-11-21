// components/ProductList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import './ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]); // Thêm state cho sản phẩm đã lọc
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(''); // Thêm state cho từ khóa tìm kiếm
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/products', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProducts(response.data);
                setFilteredProducts(response.data); // Đặt sản phẩm ban đầu cho sản phẩm đã lọc
                setError('');
            } catch (err) {
                console.error('Lỗi khi lấy sản phẩm:', err);
                setError('Lỗi khi lấy sản phẩm. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Hàm xử lý khi thay đổi từ khóa tìm kiếm
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    return (
        <div>
            <div className="header">
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                />
            </div>

            {loading && <p>Đang tải sản phẩm...</p>}
            {error && <p className="error-message">{error}</p>}
            {filteredProducts.length === 0 && !loading && <p>Không có sản phẩm nào.</p>}

            <div className="product-list">
                {filteredProducts.map(product => (
                    <div className="product-item" key={product._id}>
                        {product.imageUrl ? (
                            <Link to={`/products/${product._id}`}>
                                <img 
                                    src={`http://localhost:5000/${product.imageUrl}`} 
                                    alt={product.name} 
                                />
                            </Link>
                        ) : (
                            <p>Không có hình ảnh</p>
                        )}
                        <h3>{product.name}</h3>
                        <p className="price">Giá: {product.price} VNĐ</p>
                        <button onClick={() => addToCart(product)}>Thêm vào giỏ hàng</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
