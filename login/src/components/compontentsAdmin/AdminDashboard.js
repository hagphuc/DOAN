import React from 'react';
import HeaderAdmin from './HeaderAdmin'; // Import Header

function AdminDashboard() {
  return (
    <div>
      {/* Gắn Header lên trên, bây giờ Header sẽ chứa các nút quản lý */}
      <HeaderAdmin />

      {/* Nội dung chính của trang AdminDashboard */}
      <div style={{ padding: '20px' }}>
        <h1>Admin Dashboard</h1>
        <p>Welcome to the Admin Dashboard. Here you can manage users and products from the header above.</p>
      </div>
    </div>
  );
}

export default AdminDashboard;
