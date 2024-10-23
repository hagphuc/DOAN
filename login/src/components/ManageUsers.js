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
    Button,
    TextField,
    Typography,
    CircularProgress,
    Grid,
    Snackbar,
    Alert as MuiAlert,
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
    const [editUser, setEditUser] = useState({ username: '', email: '', role: '', password: '' });

    const [snackbarOpen, setSnackbarOpen] = useState(false); // State cho Snackbar

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
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
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/auth/delete/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSuccess('Xóa người dùng thành công!');
            setSnackbarOpen(true); // Mở Snackbar
            fetchUsers();
        } catch (err) {
            setError('Lỗi khi xóa người dùng.');
            setSnackbarOpen(true); // Mở Snackbar
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
            setSnackbarOpen(true); // Mở Snackbar
            setNewUser({ username: '', email: '', role: '', password: '' });
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.msg || 'Lỗi khi thêm người dùng.');
            setSnackbarOpen(true); // Mở Snackbar
        } finally {
            setLoading(false);
        }
    };

    const handleEditUser = (user) => {
        setEditUserId(user._id);
        setEditUser({ username: user.username, email: user.email, role: user.role, password: '' });
    };

    const handleUpdateUser = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/auth/update/${editUserId}`, editUser, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSuccess('Cập nhật người dùng thành công!');
            setSnackbarOpen(true); // Mở Snackbar
            setEditUserId(null);
            setEditUser({ username: '', email: '', role: '', password: '' });
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.msg || 'Lỗi khi cập nhật người dùng.');
            setSnackbarOpen(true); // Mở Snackbar
        } finally {
            setLoading(false);
        }
    };

    // Hàm đóng Snackbar
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
        setError('');
        setSuccess('');
    };

    return (
        <div className="container">
            <HeaderAdmin />
            <Typography variant="h4" gutterBottom className="title">Quản Lý Người Dùng</Typography>

            {/* Snackbar cho thông báo thành công hoặc lỗi */}
            <Snackbar 
                open={snackbarOpen} 
                autoHideDuration={5000} 
                onClose={handleCloseSnackbar} 
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Vị trí góc trên bên phải
            >
                <MuiAlert severity={success ? 'success' : 'error'} sx={{ width: '100%' }}>
                    {success || error}
                </MuiAlert>
            </Snackbar>

            {/* Form thêm người dùng mới */}
            <Grid container spacing={2} className="form-section">
                <Grid item xs={12} sm={3}>
                    <TextField
                        label="Tên người dùng"
                        variant="outlined"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        label="Email"
                        variant="outlined"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        label="Vai trò"
                        variant="outlined"
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        label="Mật khẩu"
                        variant="outlined"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleAddUser} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Thêm Người Dùng'}
                    </Button>
                </Grid>
            </Grid>

            {/* Form chỉnh sửa người dùng */}
            {editUserId && (
                <div className="form-section">
                    <Typography variant="h6">Chỉnh Sửa Người Dùng</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="Tên người dùng"
                                variant="outlined"
                                value={editUser.username}
                                onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="Email"
                                variant="outlined"
                                value={editUser.email}
                                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="Vai trò"
                                variant="outlined"
                                value={editUser.role}
                                onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="Mật khẩu (để trống nếu không thay đổi)"
                                variant="outlined"
                                type="password"
                                value={editUser.password}
                                onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" onClick={handleUpdateUser} disabled={loading}>
                                {loading ? <CircularProgress size={24} /> : 'Cập Nhật Người Dùng'}
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            )}

            {/* Bảng hiển thị danh sách người dùng */}
            <TableContainer component={Paper} className="table-container">
                <Table sx={{ minWidth: 650 }} aria-label="user table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Tên</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Vai trò</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user._id}>
                                <TableCell>{user._id}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleEditUser(user)}
                                        style={{ marginRight: '10px' }}
                                    >
                                        Sửa
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleDelete(user._id)}
                                    >
                                        Xóa
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default ManageUsers;
