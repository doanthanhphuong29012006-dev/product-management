const md5 = require("md5");
const User = require('../../models/user.model');

// [GET]/user/register
module.exports.register = (req, res) => {
    res.render('client/pages/user/register',{
        pageTitle: "Đăng ký tài khoản"
    });
}

// [POST]/user/register
module.exports.registerPost = async (req, res) => {
    const existEmail = await User.findOne({
        email: req.body.email
    });

    if (existEmail) {
        req.flash('error', "Email đã tồn tại!");
        const currentUrl = req.get('Referrer');
        res.redirect(currentUrl);
        return;
    }

    req.body.password = md5(req.body.password);

    const user = new User(req.body);
    user.save();

    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/");
}

// [GET]/user/login
module.exports.login = (req, res) => {
    res.render('client/pages/user/login',{
        pageTitle: "Đăng nhập tài khoản"
    });
}

// [POST]/user/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if (!user) {
        req.flash('error', "Tài khoản không tồn tại!");
        const currentUrl = req.get('Referrer');
        res.redirect(currentUrl);
        return;
    }

    if (md5(password) !== user.password) {
        console.log(password);
        req.flash('error', "Mật khẩu không chính xác!");
        const currentUrl = req.get('Referrer');
        res.redirect(currentUrl);
        return;
    }

    if (user.status === "inactive") {
        req.flash('error', "Tài khoản đang bị khóa!");
        const currentUrl = req.get('Referrer');
        res.redirect(currentUrl);
        return;
    }

    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/");
}