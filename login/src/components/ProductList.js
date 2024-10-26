import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

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

    return (
        <div>
            {loading && <p>Đang tải sản phẩm...</p>}
            {error && <p className="error-message">{error}</p>}
            {products.length === 0 && !loading && <p>Không có sản phẩm nào.</p>}
    
            <div className="product-list">
                {products.map(product => (
                    <div className="product-item" key={product._id}>
                        {product.imageUrl ? (
                            <img src={`http://localhost:5000/${product.imageUrl}`} alt={product.name} />
                        ) : (
                            <p>Không có hình ảnh</p>
                        )}
                        <h3>{product.name}</h3>
                        <p className="price">Giá: {product.price} VNĐ</p> {/* Thêm lớp cho giá */}
                        <button onClick={() => addToCart(product)}>Thêm vào giỏ hàng</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
