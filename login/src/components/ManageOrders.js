import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Typography, 
    Button, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    IconButton,
    Snackbar,
    Alert,
    Checkbox,
} from '@mui/material';
import { Visibility, Delete } from '@mui/icons-material';
import HeaderAdmin from './HeaderAdmin'; // Assuming you have a header component for admin
import './ManageOrders.css';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'; // Icon mũi tên đi lên từ MUI
import { Fab } from '@mui/material'; // Nút tròn từ MUI

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedOrders, setSelectedOrders] = useState([]);  // Mảng chứa các đơn hàng đã chọn
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // Dialog xác nhận xóa
    const [orderToDelete, setOrderToDelete] = useState(null); // Trạng thái chứa ID của đơn hàng cần xóa
    const [openConfirmDeleteAllDialog, setOpenConfirmDeleteAllDialog] = useState(false); // Dialog xác nhận xóa tất cả
    const [openDialog, setOpenDialog] = useState(false); // Open order details dialog
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/orders', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedOrder(null); // Reset selected order when closing dialog
    };

    const handleDeleteOrder = (orderId) => {
        setOrderToDelete(orderId);
        setOpenConfirmDialog(true);
    };

    const confirmDeleteOrder = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/orders/${orderToDelete}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotification({ open: true, message: 'Đơn hàng đã được xóa thành công!', severity: 'success' });
            fetchOrders();
            setOrderToDelete(null);  // Reset trạng thái ID đơn hàng
            setOpenConfirmDialog(false);  // Đóng dialog
        } catch (error) {
            console.error('Error deleting order:', error);
            setNotification({ open: true, message: 'Lỗi khi xóa đơn hàng!', severity: 'error' });
            setOrderToDelete(null);  // Reset trạng thái nếu có lỗi
            setOpenConfirmDialog(false);  // Đóng dialog nếu có lỗi
        }
    };

    const handleDeleteSelectedOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            await Promise.all(
                selectedOrders.map((orderId) => {
                    return axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                })
            );
            setNotification({ open: true, message: 'Đã xóa các đơn hàng đã chọn thành công!', severity: 'success' });
            fetchOrders();
            setSelectedOrders([]);  // Reset mảng các đơn hàng đã chọn
            setOpenConfirmDeleteAllDialog(false);  // Đóng Dialog xác nhận
        } catch (error) {
            console.error('Error deleting selected orders:', error);
            setNotification({ open: true, message: 'Lỗi khi xóa các đơn hàng!', severity: 'error' });
            setOpenConfirmDeleteAllDialog(false);  // Đóng Dialog nếu có lỗi
        }
    };

    const handleSelectOrder = (orderId) => {
        setSelectedOrders(prevSelectedOrders => {
            if (prevSelectedOrders.includes(orderId)) {
                return prevSelectedOrders.filter(id => id !== orderId);  // Nếu đã chọn, bỏ chọn
            } else {
                return [...prevSelectedOrders, orderId];  // Nếu chưa chọn, chọn
            }
        });
    };

    const handleCloseSnackbar = () => {
        setNotification({ ...notification, open: false });
    };

    const handleOpenConfirmDeleteAllDialog = () => {
        setOpenConfirmDeleteAllDialog(true);  // Mở Dialog xác nhận xóa tất cả
    };

    const handleCloseConfirmDeleteAllDialog = () => {
        setOpenConfirmDeleteAllDialog(false);  // Đóng Dialog xác nhận xóa tất cả
    };

    const handleSelectAllOrders = () => {
        if (selectedOrders.length === orders.length) {
            // Nếu tất cả sản phẩm đã được chọn, bỏ chọn tất cả
            setSelectedOrders([]);
        } else {
            // Nếu chưa chọn hết tất cả, chọn tất cả
            setSelectedOrders(orders.map(order => order._id));
        }
    };
    // Hàm kiểm tra vị trí cuộn và hiển thị nút lên đầu trang
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300); // Hiển thị nút khi cuộn xuống hơn 300px
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Hàm cuộn lên đầu trang
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="manage-orders">
            {/* Nút mũi tên đi lên */}
            {showScrollTop && (
                <Fab
                    color="default"  // Giữ màu icon mặc định hoặc có thể dùng "primary" nếu muốn màu khác
                    onClick={scrollToTop}
                    className="scroll-to-top"
                    aria-label="scroll to top"
                    sx={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        backgroundColor: 'white', // Màu nền trắng
                        color: 'black', // Màu icon đen (có thể thay đổi)
                        '&:hover': {
                            backgroundColor: '#f0f0f0' // Màu nền khi hover
                        }
                    }}
                >
                    <ArrowUpwardIcon />
                </Fab>
            )}
            <HeaderAdmin />
            <Typography variant="h4" gutterBottom className="title" style={{ marginTop: '80px' }} >
                Quản Lý Đơn Hàng
            </Typography>

            {/* Nút Xóa Đơn Hàng Đã Chọn */}
            {selectedOrders.length > 0 && (
                <Button 
                    variant="contained" 
                    color="error" 
                    startIcon={<Delete />} // Add icon for delete all
                    style={{ marginBottom: '20px' }} 
                    onClick={handleOpenConfirmDeleteAllDialog}  // Mở Dialog xác nhận khi nhấn
                >
                    Xóa Đơn Hàng Đã Chọn
                </Button>
            )}

            <TableContainer component={Paper}>
                <Table aria-label="orders table">
                    <TableHead>
                        <TableRow>
                            <TableCell className="table-cell">
                                <Button
                                    variant="outlined"
                                    color={selectedOrders.length === orders.length ? "primary" : "default"}
                                    onClick={handleSelectAllOrders}
                                >
                                    {selectedOrders.length === orders.length ? "Bỏ Chọn Tất Cả" : "Chọn Tất Cả"}
                                </Button>
                            </TableCell>
                            <TableCell>Mã Đơn Hàng</TableCell>
                            <TableCell>Khách Hàng</TableCell>
                            <TableCell>Số Lượng Sản Phẩm</TableCell>
                            <TableCell>Tổng Tiền (VNĐ)</TableCell>
                            <TableCell>Hành Động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order._id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedOrders.includes(order._id)}
                                        onChange={() => handleSelectOrder(order._id)}
                                    />
                                </TableCell>
                                <TableCell>{order._id}</TableCell>
                                <TableCell>{order.customerInfo?.name}</TableCell>
                                <TableCell>{order.items.length}</TableCell>
                                <TableCell>{order.totalAmount}</TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => handleViewOrder(order)}>
                                        <Visibility />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDeleteOrder(order._id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Order Details Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle className="dialog-title">Chi Tiết Đơn Hàng</DialogTitle>
                {selectedOrder && (
                    <DialogContent className="dialog-content">
                        <div className="dialog-section">
                            <Typography variant="h6" className="dialog-header">Khách Hàng</Typography>
                            <Typography className="dialog-item">Tên: {selectedOrder.customerInfo.name}</Typography>
                            <Typography className="dialog-item">Email: {selectedOrder.customerInfo.email}</Typography>
                            <Typography className="dialog-item">Số Điện Thoại: {selectedOrder.customerInfo.phone}</Typography>
                            <Typography className="dialog-item">Địa Chỉ: {selectedOrder.customerInfo.address}</Typography>
                        </div>

                        <div className="dialog-section">
                            <Typography variant="h6" className="dialog-header">Sản Phẩm</Typography>
                            {selectedOrder.items.map((item, index) => (
                                <div key={index} className="product-item">
                                    <Typography className="product-info">Mã Sản Phẩm: {item.productId._id}</Typography>
                                    <Typography className="product-info">Tên: {item.productId.name}</Typography>
                                    <Typography className="product-info">Giá: {item.productId.price} VNĐ</Typography>
                                    <Typography className="product-info">Số Lượng: {item.quantity}</Typography>
                                </div>
                            ))}
                        </div>

                        <div className="total-amount">
                            <Typography variant="h6">Tổng Tiền:</Typography>
                            <Typography>{selectedOrder.totalAmount} VNĐ</Typography>
                        </div>
                    </DialogContent>
                )}
                <DialogActions className="dialog-actions">
                    <Button onClick={handleCloseDialog} color="primary">Đóng</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog xác nhận xóa */}
            <Dialog
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
            >
                <DialogTitle>Xác Nhận Xóa Đơn Hàng</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn xóa đơn hàng này không?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={confirmDeleteOrder} color="error">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog xác nhận xóa tất cả */}
            <Dialog open={openConfirmDeleteAllDialog} onClose={handleCloseConfirmDeleteAllDialog}>
                <DialogTitle>Xác Nhận Xóa Các Đơn Hàng Đã Chọn</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn xóa tất cả các đơn hàng đã chọn không?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDeleteAllDialog} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleDeleteSelectedOrders} color="error">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notification Snackbar */}
            <Snackbar
                open={notification.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Alert severity={notification.severity}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default ManageOrders;
