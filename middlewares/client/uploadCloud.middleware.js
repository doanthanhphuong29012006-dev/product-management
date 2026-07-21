const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Config Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_KEY, 
  api_secret: process.env.CLOUD_SECRET
});
// End Config Cloudinary

module.exports.upload = (req, res, next) => {
    if (!req.file) {
        return next();
    }

    let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
            (error, result) => {
                if (result) {
                resolve(result);
                } else {
                reject(error);
                }
            }
            );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };

    async function upload(req) {
        try {
            let result = await streamUpload(req);
            req.body[req.file.fieldname] = result.url;
            next();
        } catch (error) {
            console.error("Lỗi upload ảnh lên Cloudinary:", error);
            // Gửi lỗi để server không bị crash
            next(error); 
        }
    }

    upload(req);
}