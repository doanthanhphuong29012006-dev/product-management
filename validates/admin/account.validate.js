module.exports.createPost = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash('error', "Vui lòng nhập tên!");

        const currentUrl = req.get("Referrer");
        res.redirect(currentUrl);
        return;
    }

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

module.exports.editPatch = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash('error', "Vui lòng nhập tên!");

        const currentUrl = req.get("Referrer");
        res.redirect(currentUrl);
        return;
    }

    if (!req.body.email) {
        req.flash('error', "Vui lòng nhập email!");

        const currentUrl = req.get("Referrer");
        res.redirect(currentUrl);
        return;
    }
    
    next();
}