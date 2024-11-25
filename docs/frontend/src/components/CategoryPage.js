import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { useCart } from './CartContext'; // Import useCart hook
import Header from './Header'; // Import Header component

const CategoryPage = () => {
    const { categoryId } = useParams();
    const { addToCart } = useCart(); // Remove cartItems since it's not used
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);  // Store category data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategoryAndProducts = async () => {
            try {
                // Fetch category name based on categoryId
                const categoryResponse = await axios.get(`http://localhost:5000/api/categories/${categoryId}`);
                setCategory(categoryResponse.data);  // Store category data
                
                // Fetch products for the category
                const productsResponse = await axios.get(`http://localhost:5000/api/categories/${categoryId}/products`);
                setProducts(productsResponse.data);
                setLoading(false);
            } catch (err) {
                setError('Không thể tải dữ liệu');
                setLoading(false);
            }
        };

        fetchCategoryAndProducts();
    }, [categoryId]);

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="category-page">
            {/* Header component */}
            <Header />

            {/* Title with "Danh sách" and category name */}
            <div style={{ textAlign: 'center', marginTop: '-50px', marginBottom: '20px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>
                    Danh sách {category && category.name}
                </h1>
            </div>

            {/* Product list */}
            <div className="product-list">
                {products.length > 0 ? (
                    products.map((product) => (
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
                            <button onClick={() => addToCart(product)}>
                                Thêm vào giỏ hàng
                            </button>
                        </div>
                    ))
                ) : (
                    <p>Không có sản phẩm trong danh mục này</p>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
