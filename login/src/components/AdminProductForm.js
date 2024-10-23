// src/components/AdminProductForm.js
import React, { useState } from 'react';
import axios from 'axios';

const AdminProductForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState(''); // Trạng thái thông báo lỗi
    const [loading, setLoading] = useState(false); // Trạng thái loading

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        if (image) {
            formData.append('image', image);
        }

        setLoading(true); // Bắt đầu loading

        try {
            const token = localStorage.getItem('token'); // Lấy token từ localStorage
            await axios.post('http://localhost:5000/api/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`, // Thêm token vào header
                },
            });
            alert('Sản phẩm đã được thêm thành công!');
            // Reset form
            setName('');
            setDescription('');
            setPrice('');
            setImage(null);
            setError(''); // Xóa thông báo lỗi nếu thành công
        } catch (error) {
            console.error('Error adding product:', error);
            setError(error.response?.data?.msg || 'Lỗi khi thêm sản phẩm.'); // Cập nhật thông báo lỗi
            alert(error.response?.data?.msg || 'Lỗi khi thêm sản phẩm.'); // Hiển thị thông báo lỗi
        } finally {
            setLoading(false); // Kết thúc loading
        }
    };

    return (
        <div>
            <h2>Thêm Sản Phẩm Mới</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Tên sản phẩm:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Mô tả:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Giá:</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Hình ảnh:</label>
                    <input
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Thêm sản phẩm'}
                </button>
            </form>
            {/* Hiển thị thông báo lỗi nếu có */}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default AdminProductForm;
