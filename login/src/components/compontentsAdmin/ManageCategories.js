import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HeaderAdmin from './HeaderAdmin';
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
    Alert,
    Typography, 
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const CategoryManage = () => {
    const [categories, setCategories] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [newCategory, setNewCategory] = useState({ name: '' });
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchCategories();
    }, []);

    // Lấy danh sách danh mục từ API
    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/categories', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories(response.data);
        } catch (err) {
            setNotification({ open: true, message: 'Lỗi khi lấy danh sách danh mục.', severity: 'error' });
        }
    };

    // Xử lý thêm hoặc cập nhật danh mục
    const handleSaveCategory = async () => {
        try {
            const token = localStorage.getItem('token');
            if (editingCategory) {
                await axios.put(`http://localhost:5000/api/categories/${editingCategory._id}`, newCategory, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setNotification({ open: true, message: 'Danh mục đã được cập nhật thành công!', severity: 'success' });
            } else {
                await axios.post('http://localhost:5000/api/categories', newCategory, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setNotification({ open: true, message: 'Danh mục đã được thêm thành công!', severity: 'success' });
            }
            fetchCategories();
            handleCloseDialog();
        } catch (err) {
            setNotification({ open: true, message: 'Lỗi khi lưu danh mục!', severity: 'error' });
        }
    };

    // Xử lý hiển thị form sửa danh mục
    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setNewCategory({ name: category.name });
        setOpenDialog(true);
    };

    // Xử lý hiển thị form thêm danh mục mới
    const handleAddCategory = () => {
        setEditingCategory(null);
        setNewCategory({ name: '' });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingCategory(null);
        setNewCategory({ name: '' });
    };

    // Xác nhận xóa danh mục
    const handleDeleteCategory = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/categories/${categoryToDelete._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotification({ open: true, message: 'Danh mục đã được xóa thành công!', severity: 'success' });
            fetchCategories();
            setOpenDeleteDialog(false);
        } catch (err) {
            setNotification({ open: true, message: 'Lỗi khi xóa danh mục!', severity: 'error' });
        }
    };

    // Hiển thị dialog xác nhận xóa
    const handleDeleteConfirmation = (category) => {
        setCategoryToDelete(category);
        setOpenDeleteDialog(true);
    };

    return (
        <div className="category-management">
            <HeaderAdmin />
            <Typography
                variant="h4"
                gutterBottom
                style={{
                    marginTop: '80px',
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    background: 'linear-gradient(to right, #f3c9c4, #FFB6C1)', // Gradient màu
                    WebkitBackgroundClip: 'text', // Clip gradient vào chữ
                    WebkitTextFillColor: 'transparent', // Làm chữ trong suốt để thấy gradient
                    textAlign: 'center', // Căn giữa nếu cần
                }}
            >
                Quản Lý Danh Mục
            </Typography>
            <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={handleAddCategory}
                style={{ margin: '20px 0' }}
            >
                Thêm Danh Mục
            </Button>

            {/* Bảng hiển thị danh mục */}
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Tên Danh Mục</TableCell>
                            <TableCell align="center">Hành Động</TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
            </TableContainer>

            {/* Danh sách sản phẩm trong từng danh mục */}
            {categories.map((category) => (
                <Accordion key={category._id}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel-${category._id}-content`}
                        id={`panel-${category._id}-header`}
                    >
                        <h3>{category.name}</h3>
                    </AccordionSummary>
                    <AccordionDetails>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Tên Sản Phẩm</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {category.products && category.products.length > 0 ? (
                                        category.products.map((product) => (
                                            <TableRow key={product._id}>
                                                <TableCell>{product.name}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={1}>Chưa có sản phẩm</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {/* Nút Sửa và Xóa cho mỗi danh mục */}
                        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<Edit />}
                                onClick={() => handleEditCategory(category)}
                                style={{ marginRight: '10px' }}
                            >
                                Sửa
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                startIcon={<Delete />}
                                onClick={() => handleDeleteConfirmation(category)}
                            >
                                Xóa
                            </Button>
                        </div>
                    </AccordionDetails>
                </Accordion>
            ))}

            {/* Dialog thêm/sửa danh mục */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{editingCategory ? 'Sửa Danh Mục' : 'Thêm Danh Mục'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Tên Danh Mục"
                        fullWidth
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleSaveCategory} color="primary">
                        {editingCategory ? 'Cập Nhật' : 'Thêm'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog xác nhận xóa */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Xác Nhận Xóa Danh Mục</DialogTitle>
                <DialogContent>
                    Bạn có chắc chắn muốn xóa danh mục "{categoryToDelete?.name}" không?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleDeleteCategory} color="secondary">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={() => setNotification({ ...notification, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert severity={notification.severity}>{notification.message}</Alert>
            </Snackbar>
        </div>
    );
};

export default CategoryManage;
