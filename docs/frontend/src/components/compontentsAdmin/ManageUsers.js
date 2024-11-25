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
    Checkbox,
} from '@mui/material';
import './ManageUsers.css';
import HeaderAdmin from './HeaderAdmin';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'; // Icon mũi tên đi lên từ MUI
import { Fab } from '@mui/material'; // Nút tròn từ MUI

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', email: '', role: '', password: '' });
    const [editUserId, setEditUserId] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);
    const [hoverButton, setHoverButton] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]); // State cho người dùng đã chọn
    const [confirmDeleteSelectedDialogOpen, setConfirmDeleteSelectedDialogOpen] = useState(false); // For multi-user delete confirmation
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); // Trạng thái cho từ khóa tìm kiếm

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
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Select/Deselect all users
    const handleSelectAllUsers = () => {
        if (selectedUsers.length === users.length) {
            setSelectedUsers([]); // Deselect all
        } else {
            setSelectedUsers(users.map((user) => user._id)); // Select all
        }
    };

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
            handleCloseDialog();
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
        setDialogOpen(true);
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
            handleCloseDialog();
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.msg || 'Lỗi khi cập nhật người dùng.');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = () => {
        setEditUserId(null);
        setNewUser({ username: '', email: '', role: '', password: '' });
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditUserId(null);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
        setError('');
        setSuccess('');
    };

    const handleDelete = (userId) => {
        setUserIdToDelete(userId);
        setConfirmDeleteDialogOpen(true);
    };

    const handleCloseConfirmDeleteDialog = () => {
        setConfirmDeleteDialogOpen(false);
        setUserIdToDelete(null);
    };

    const handleSelectUser = (userId) => {
        setSelectedUsers((prevSelected) => {
            if (prevSelected.includes(userId)) {
                return prevSelected.filter((id) => id !== userId);
            } else {
                return [...prevSelected, userId];
            }
        });
    };

    const handleDeleteSelectedUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await Promise.all(
                selectedUsers.map((userId) =>
                    axios.delete(`http://localhost:5000/api/auth/delete/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                )
            );
            setSuccess('Đã xóa tất cả người dùng đã chọn!');
            setSnackbarOpen(true);
            setSelectedUsers([]);
            fetchUsers();
        } catch (err) {
            setError('Lỗi khi xóa người dùng.');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDeleteSelectedDialog = () => {
        setConfirmDeleteSelectedDialogOpen(true);
    };

    const handleCloseDeleteSelectedDialog = () => {
        setConfirmDeleteSelectedDialogOpen(false);
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

    // Hàm lọc người dùng theo từ khóa tìm kiếm
    const filteredUsers = users.filter(user => {
        return (
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.role.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);  // Cập nhật từ khóa tìm kiếm
    };

    return (
        <div className="manage-users">
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
            {/* Thêm ô nhập liệu tìm kiếm */}
            <TextField
                label="Tìm kiếm người dùng"
                variant="outlined"
                value={searchQuery}
                onChange={handleSearchChange}
                fullWidth
                style={{ marginBottom: '20px' }}

            />

            <Button
                variant="contained"
                color="primary"
                onClick={handleOpenDialog}
                style={{ marginBottom: '20px' }}
                onMouseEnter={() => setHoverButton('add')}
                onMouseLeave={() => setHoverButton(null)}
                startIcon={<AddIcon />} // Add this line
                sx={{
                    backgroundColor: hoverButton === 'add' ? '#4caf50' : undefined,
                    '&:hover': {
                        backgroundColor: '#4caf50',
                    },
                }}
            >
                Thêm Người Dùng
            </Button>

            {selectedUsers.length > 0 && (
                <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />} // Add this line
                    onClick={handleOpenDeleteSelectedDialog}
                    sx={{
                        '&:hover': {
                            backgroundColor: 'darkred',
                            color: 'white'
                        },
                        marginLeft: '10px',
                        top: '-10px',
                        height: '38px'
                    }}
                >
                    Xóa Người Dùng Đã Chọn
                </Button>
            )}
            <TableContainer component={Paper} className="table-container">
                <Table aria-label="product table">
                    <TableHead>
                        <TableRow>
                            <TableCell className="table-cell">
                                <Button
                                    variant="outlined"
                                    color={selectedUsers.length === users.length ? "primary" : "default"}
                                    onClick={handleSelectAllUsers}
                                >
                                    {selectedUsers.length === users.length ? "Bỏ Chọn Tất Cả" : "Chọn Tất Cả"}
                                </Button>
                            </TableCell>
                            <TableCell className="table-cell">Tên</TableCell>
                            <TableCell className="table-cell">Email</TableCell>
                            <TableCell className="table-cell">Vai trò</TableCell>
                            <TableCell className="table-cell">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} style={{ textAlign: 'center' }}>
                                    No data
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedUsers.includes(user._id)}
                                            onChange={() => handleSelectUser(user._id)}
                                        />
                                    </TableCell>
                                    <TableCell className="table-cell-body">{user.username}</TableCell>
                                    <TableCell className="table-cell-body">{user.email}</TableCell>
                                    <TableCell className="table-cell-body">{user.role}</TableCell>
                                    <TableCell className="table-cell-body">
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleEditUser(user)}
                                            className="custom-button"
                                            style={{ marginRight: '8px' }}
                                            startIcon={<EditIcon />}
                                        >
                                            Cập nhật
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => handleDelete(user._id)}
                                            className="custom-button"
                                            startIcon={<DeleteIcon />}
                                        >
                                            Xóa
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog 
                open={dialogOpen} 
                onClose={handleCloseDialog} 
                maxWidth="sm"
                fullWidth
                >
                <DialogTitle style={{ textAlign: 'center' }}>
                {editUserId ? 'Chỉnh Sửa Người Dùng' : 'Thêm Người Dùng'}</DialogTitle>
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
                                backgroundColor: '#4caf50',
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
                                backgroundColor: '#4caf50',
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
                            backgroundColor: 'green',
                            color: 'white'
                        }
                    }}>
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
                                backgroundColor: 'green',
                                color: 'white'
                            }
                        }}
                    >
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={confirmDeleteSelectedDialogOpen}
                onClose={handleCloseDeleteSelectedDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Xác Nhận Xóa Người Dùng Đã Chọn</DialogTitle>
                <DialogContent>
                    <Typography>Bạn có chắc chắn muốn xóa những người dùng đã chọn không?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteSelectedDialog} color="secondary">
                        Hủy
                    </Button>
                    <Button
                        onClick={() => {
                            handleDeleteSelectedUsers();
                            handleCloseDeleteSelectedDialog();
                        }}
                        color="primary"
                    >
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
export default ManageUsers;
