const md5 = require('md5');
const Account = require('../../models/account.model');
const systemConfig = require('../../config/system');

// [GET] /admin/auth/login
module.exports.login = (req, res) => {
    if (req.cookies.token) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    } else {
        res.render('admin/pages/auth/login', {
            pageTitle: "Trang đăng nhập"
        });
    }
};

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
    const { email, password } = req.body;
    
    const user = await Account.findOne({
        email: email,
        deleted: false
    });

    if (!user) {
        req.flash('error', "Tài khoản hoặc mật khẩu không chính xác!");
        const currentUrl = req.get('Referrer');
        res.redirect(currentUrl);
        return;
    }

    if (md5(password) != user.password) {
        req.flash('error', "Tài khoản hoặc mật khẩu không chính xác!");
        const currentUrl = req.get('Referrer');
        res.redirect(currentUrl);
        return;
    }

    if (user.status != "active") {
        req.flash('error', "Tài khoản đã bị khóa!");
        const currentUrl = req.get('Referrer');
        res.redirect(currentUrl);
        return;
    }

    res.cookie("token", user.token);
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
};

// [GET] /admin/auth/logout
module.exports.logout = (req, res) => {
    res.clearCookie("token");
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
};

// [GET] /admin/auth/signup
module.exports.signup = (req, res) => {
    res.render('admin/pages/errors/404', {
        pageTitle: "Trang đăng ký"
    });
};