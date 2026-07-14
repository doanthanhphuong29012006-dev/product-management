module.exports.loginPost = (req, res, next) => {
    if (!req.body.email) {
        req.flash('error', "Vui lòng nhập email!");

        const currentUrl = req.get("Referrer");
        res.redirect(currentUrl);
        return;
    }

    if (!req.body.password) {
        req.flash('error', "Vui lòng nhập mật khẩu!");

        const currentUrl = req.get("Referrer");
        res.redirect(currentUrl);
        return;
    }
    
    next();
}