import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HeaderAdmin from './HeaderAdmin';
import Typography from '@mui/material/Typography';
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
import './ManageProducts.css';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', image: null });
    const [productIdToDelete, setProductIdToDelete] = useState(null); // Trạng thái để lưu ID sản phẩm cần xóa
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchProducts();
    }, []);

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

    const handleSaveProduct = async () => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('name', newProduct.name);
            formData.append('price', newProduct.price);
            formData.append('description', newProduct.description);
            if (newProduct.image) {
                formData.append('image', newProduct.image);
            }

            if (editingProduct) {
                await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setNotification({ open: true, message: 'Sản phẩm đã được cập nhật thành công!', severity: 'success' });
            } else {
                await axios.post('http://localhost:5000/api/products', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setNotification({ open: true, message: 'Sản phẩm đã được thêm thành công!', severity: 'success' });
            }
            fetchProducts();
            handleCloseDialog();
        } catch (err) {
            setNotification({ open: true, message: 'Lỗi khi lưu sản phẩm!', severity: 'error' });
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setNewProduct({ name: product.name, price: product.price, description: product.description, image: null });
        setOpenDialog(true);
    };

    const handleConfirmDeleteProduct = (id) => {
        setProductIdToDelete(id); // Lưu id sản phẩm để xóa
        setOpenConfirmDialog(true); // Mở dialog xác nhận
    };

    const handleDeleteProduct = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/products/${productIdToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNotification({ open: true, message: 'Sản phẩm đã được xóa thành công!', severity: 'success' });
            fetchProducts();
            handleCloseConfirmDialog(); // Đóng dialog xác nhận
        } catch (err) {
            setNotification({ open: true, message: 'Lỗi khi xóa sản phẩm!', severity: 'error' });
        }
    };

    const handleAddProduct = () => {
        setEditingProduct(null);
        setNewProduct({ name: '', price: '', description: '', image: null });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };

    const handleCloseSnackbar = () => {
        setNotification({ ...notification, open: false });
    };

    const handleImageChange = (e) => {
        setNewProduct({ ...newProduct, image: e.target.files[0] });
    };

    return (
        <div className="manage-products">
            <HeaderAdmin />
            <Typography variant="h4" gutterBottom className="title" style={{ marginTop: '80px' }}>
                Quản Lý Sản Phẩm
            </Typography>
            {error && <p>{error}</p>}
            <Button
                variant="contained"
                color="primary"
                onClick={handleAddProduct}
                sx={{
                    '&:hover': {
                        backgroundColor: 'green',
                        color: 'white'
                    }
                }}
            >
                Thêm Sản Phẩm
            </Button>
            <TableContainer component={Paper} className="product-table">
                <Table aria-label="product table">
                    <TableHead>
                        <TableRow>
                            <TableCell className="table-cell">Hình Ảnh</TableCell>
                            <TableCell className="table-cell">Tên Sản Phẩm</TableCell>
                            <TableCell className="table-cell">Giá</TableCell>
                            <TableCell className="table-cell">Mô Tả</TableCell>
                            <TableCell className="table-cell">Hành Động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product._id}>
                                <TableCell>
                                    <img src={`http://localhost:5000/${product.imageUrl}`} alt={product.name} className="product-image" />
                                </TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.price} VNĐ</TableCell>
                                <TableCell>{product.description}</TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() => handleEditProduct(product)}
                                        variant="contained"
                                        color="secondary"
                                        sx={{
                                            mr: 1,
                                            '&:hover': {
                                                backgroundColor: 'green',
                                                color: 'white'
                                            }
                                        }}
                                    >
                                        Sửa
                                    </Button>
                                    <Button
                                        onClick={() => handleConfirmDeleteProduct(product._id)} // Gọi hàm xác nhận xóa
                                        variant="contained"
                                        color="error"
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: 'green',
                                                color: 'white'
                                            }
                                        }}
                                    >
                                        Xóa
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{editingProduct ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Tên sản phẩm"
                        fullWidth
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Giá sản phẩm"
                        type="number"
                        fullWidth
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Mô tả sản phẩm"
                        fullWidth
                        multiline
                        rows={3}
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    />
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="upload-image"
                        type="file"
                        onChange={handleImageChange}
                    />
                    <label htmlFor="upload-image">
                        <Button variant="contained" component="span" color="primary">
                            {newProduct.image ? newProduct.image.name : 'Chọn Hình Ảnh'}
                        </Button>
                    </label>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseDialog}
                        color="primary"
                        sx={{
                            '&:hover': {
                                backgroundColor: 'green',
                                color: 'white'
                            }
                        }}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSaveProduct}
                        color="primary"
                        sx={{
                            '&:hover': {
                                backgroundColor: 'green',
                                color: 'white'
                            }
                        }}
                    >
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
                <DialogTitle>Xác Nhận</DialogTitle>
                <DialogContent>
                    <Typography>Bạn có chắc chắn muốn xóa sản phẩm này không?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseConfirmDialog}
                        color="primary"
                        sx={{
                            '&:hover': {
                                backgroundColor: 'green', // Màu nền khi hover
                                color: 'white' // Màu chữ khi hover
                            }
                        }}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleDeleteProduct}
                        color="error"
                        sx={{
                            '&:hover': {
                                backgroundColor: 'green', // Màu nền khi hover
                                color: 'white' // Màu chữ khi hover
                            }
                        }}
                    >
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert severity={notification.severity} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

