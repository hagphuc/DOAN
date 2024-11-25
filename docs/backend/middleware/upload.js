// middleware/upload.js
const multer = require('multer');

// Cấu hình nơi lưu trữ hình ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Thư mục để lưu trữ hình ảnh
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Tạo tên tệp duy nhất
    }
});

// Tạo middleware multer
const upload = multer({ storage: storage });

module.exports = upload;
