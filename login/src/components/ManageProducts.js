import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/products', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProducts(response.data);
            } catch (err) {
                setError('Lỗi khi lấy danh sách sản phẩm.');
            }
        };
        fetchProducts();
    }, []);

    return (
        <div>
            <h2>Quản lý sản phẩm</h2>
            {error && <p>{error}</p>}
            <ul>
                {products.map(product => (
                    <li key={product._id}>{product.name} - Giá: {product.price} VNĐ</li>
                ))}
            </ul>
        </div>
    );
};

export default ManageProducts;
