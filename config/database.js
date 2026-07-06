const mongoose = require('mongoose');

module.exports.connect = async () => {
    try {
        // Kiểm tra xem Mongoose đã có kết nối nào đang mở chưa
        // readyState === 1 nghĩa là đã kết nối thành công
        if (mongoose.connection.readyState === 1) {
            console.log("Đã có sẵn kết nối MongoDB. Đang tái sử dụng...");
            return; // Dừng lại ở đây, không tạo thêm kết nối mới
        }

        // Nếu chưa có, mới tiến hành gọi connect
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connect Database Success!");
    } catch (error) {
        console.log("Connect Database Error:", error);
    }
};


