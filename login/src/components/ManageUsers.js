import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
    Typography,
    CircularProgress,
    Grid,
    Snackbar,
    Alert as MuiAlert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import './ManageUsers.css'; // Nhập file CSS
import HeaderAdmin from './HeaderAdmin'; // Đảm bảo đường dẫn đúng

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', email: '', role: '', password: '' });
    const [editUserId, setEditUserId] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false); // Thêm state cho dialog
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false); // State cho dialog xác nhận xóa
    const [userIdToDelete, setUserIdToDelete] = useState(null); // ID người dùng để xóa
    const [hoverButton, setHoverButton] = useState(null); // Thêm state để theo dõi hover

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/auth/users', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(response.data);
        } catch (err) {
            setError('Lỗi khi lấy danh sách người dùng.');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    }, []); // Chỉ cần chạy một lần

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]); // Thêm fetchUsers vào mảng phụ thuộc

    const handleDeleteUser = async (userId) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/auth/delete/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSuccess('Xóa người dùng thành công!');
            setSnackbarOpen(true);
            fetchUsers();
        } catch (err) {
            setError('Lỗi khi xóa người dùng.');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/auth/register', newUser, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSuccess('Thêm người dùng thành công!');
            setSnackbarOpen(true);
            handleCloseDialog(); // Đóng dialog sau khi thêm
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.msg || 'Lỗi khi thêm người dùng.');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleEditUser = (user) => {
        setEditUserId(user._id);
        setNewUser({ username: user.username, email: user.email, role: user.role, password: '' });
        setDialogOpen(true); // Mở dialog khi chỉnh sửa
    };

    const handleUpdateUser = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/auth/update/${editUserId}`, newUser, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSuccess('Cập nhật người dùng thành công!');
            setSnackbarOpen(true);
            handleCloseDialog(); // Đóng dialog sau khi cập nhật
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.msg || 'Lỗi khi cập nhật người dùng.');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = () => {
        setEditUserId(null); // Đặt lại ID khi mở dialog để thêm
        setNewUser({ username: '', email: '', role: '', password: '' });
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditUserId(null); // Đặt lại ID khi đóng dialog
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
        setError('');
        setSuccess('');
    };

    const handleDelete = (userId) => {
        setUserIdToDelete(userId); // Lưu ID người dùng để xóa
        setConfirmDeleteDialogOpen(true); // Mở dialog xác nhận
    };

    const handleCloseConfirmDeleteDialog = () => {
        setConfirmDeleteDialogOpen(false);
        setUserIdToDelete(null); // Đặt lại ID khi đóng dialog
    };

    return (
        <div className="manage-users">
            <HeaderAdmin />
            <Typography variant="h4" gutterBottom className="title" style={{ marginTop: '80px' }}>
                Quản Lý Người Dùng
            </Typography>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MuiAlert severity={success ? 'success' : 'error'} sx={{ width: '100%' }}>
                    {success || error}
                </MuiAlert>
            </Snackbar>

            <Button
                variant="contained"
                color="primary"
                onClick={handleOpenDialog}
                style={{ marginBottom: '20px' }}
                onMouseEnter={() => setHoverButton('add')}
                onMouseLeave={() => setHoverButton(null)}
                sx={{
                    backgroundColor: hoverButton === 'add' ? '#4caf50' : undefined,
                    '&:hover': {
                        backgroundColor: '#4caf50', // Màu xanh lá cây khi hover
                    },
                }}
            >
                Thêm Người Dùng
            </Button>

            {/* Bảng hiển thị danh sách người dùng */}
            <TableContainer component={Paper} className="table-container">
                <Table sx={{ minWidth: 650 }} aria-label="user table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Tên</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Vai trò</TableCell>
                            <TableCell>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleEditUser(user)}
                                        className="custom-button"
                                        style={{ marginRight: '8px' }}
                                    >
                                        Chỉnh sửa
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleDelete(user._id)} // Mở dialog xác nhận
                                        className="custom-button"
                                    >
                                        Xóa
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog 
                open={dialogOpen} 
                onClose={handleCloseDialog} 
                maxWidth="sm" // Đặt chiều rộng tối đa của dialog
                fullWidth // Chiếm toàn bộ chiều rộng
            >
                <DialogTitle>{editUserId ? 'Chỉnh Sửa Người Dùng' : 'Thêm Người Dùng'}</DialogTitle>
                <DialogContent style={{ padding: '16px 24px', minHeight: '300px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Tên người dùng"
                                variant="outlined"
                                value={newUser.username}
                                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                variant="outlined"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Vai trò"
                                variant="outlined"
                                value={newUser.role}
                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Mật khẩu (để trống nếu không thay đổi)"
                                variant="outlined"
                                type="password"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseDialog}
                        color="secondary"
                        onMouseEnter={() => setHoverButton('cancel')}
                        onMouseLeave={() => setHoverButton(null)}
                        sx={{
                            backgroundColor: hoverButton === 'cancel' ? '#4caf50' : undefined,
                            '&:hover': {
                                backgroundColor: '#4caf50', // Màu xanh lá cây khi hover
                            },
                        }}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={editUserId ? handleUpdateUser : handleAddUser}
                        color="primary"
                        disabled={loading}
                        onMouseEnter={() => setHoverButton(editUserId ? 'update' : 'add')}
                        onMouseLeave={() => setHoverButton(null)}
                        sx={{
                            backgroundColor: hoverButton === (editUserId ? 'update' : 'add') ? '#4caf50' : undefined,
                            '&:hover': {
                                backgroundColor: '#4caf50', // Màu xanh lá cây khi hover
                            },
                        }}
                    >
                        {loading ? <CircularProgress size={24} /> : (editUserId ? 'Cập Nhật' : 'Thêm')}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={confirmDeleteDialogOpen}
                onClose={handleCloseConfirmDeleteDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Xác Nhận Xóa</DialogTitle>
                <DialogContent>
                    <Typography>Bạn có chắc chắn muốn xóa người dùng này không?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDeleteDialog} color="secondary"
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
                        onClick={() => {
                            handleDeleteUser(userIdToDelete);
                            handleCloseConfirmDeleteDialog();
                        }}
                        color="primary"
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
        </div>
    );
};

export default ManageUsers;
