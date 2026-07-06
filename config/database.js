const mongoose = require('mongoose');

// Khởi tạo biến toàn cục để lưu trữ kết nối giữa các vòng đời Serverless
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

module.exports.connect = async () => {
    // Nếu kết nối vẫn còn sống và đã được cache, trả về dùng luôn
    if (cached.conn) {
        return cached.conn;
    }

    // Nếu chưa có kết nối, tiến hành tạo mới
    if (!cached.promise) {
        const opts = {
            bufferCommands: false, // Tắt tính năng chờ để báo lỗi ngay nếu sập mạng
        };

        cached.promise = mongoose.connect(process.env.MONGO_URL, opts).then((mongoose) => {
            console.log("Đã tạo kết nối MongoDB mới thành công!");
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null; // Xóa cache lỗi để lần sau thử kết nối lại
        console.log("Lỗi kết nối MongoDB:", e);
        throw e;
    }

    return cached.conn;
};