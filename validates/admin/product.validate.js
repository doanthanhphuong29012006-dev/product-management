module.exports.createPost = (req, res, next) => {
    if (!req.body.title) {
        req.flash('error', "Vui lòng nhập tiêu đề!");

        const currentUrl = req.get("Referrer");
        res.redirect(currentUrl);
        return;
    }
    
    next();
}