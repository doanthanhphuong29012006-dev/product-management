module.exports.registerPost = (req, res, next) => {
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

module.exports.forgotPasswordPost = (req, res, next) => {
    if (!req.body.email) {
        req.flash('error', "Vui lòng nhập email!");

        const currentUrl = req.get("Referrer");
        res.redirect(currentUrl);
        return;
    }
    
    next();
}

module.exports.resetPasswordPost = (req, res, next) => {
    if (!req.body.password || !req.body.confirmPassword) {
        req.flash('error', "Vui lòng nhập đủ thông tin!");

        const currentUrl = req.get("Referrer");
        res.redirect(currentUrl);
        return;
    }

    if (req.body.password  !== req.body.confirmPassword) {
        req.flash('error', "Mật khẩu không khớp");

        const currentUrl = req.get("Referrer");
        res.redirect(currentUrl);
        return;
    }
    
    next();
}