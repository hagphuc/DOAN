import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';  // Kiểm tra xem có lỗi gì ở file CSS này không, bạn có thể tạm bỏ nó
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')  // Đảm bảo rằng ID này khớp với `public/index.html`
);
