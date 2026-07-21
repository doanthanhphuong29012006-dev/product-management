const md5 = require("md5");
const User = require('../../models/user.model');
const ForgotPassword = require('../../models/forgot-password.model');
const Cart = require('../../models/cart.model');

const generateHelper = require('../../helpers/generate');
const sendMailHelper = require('../../helpers/sendMail');

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
    await user.save();

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

    const cart = await Cart.findOne({ user_id: user.id});

    if (!cart) {
        await Cart.updateOne({
            _id: req.cookies.cartId
        }, {
            user_id: user.id
        });
    } else {
        res.cookie("cartId", cart.id);
    }

    res.redirect("/");
}

// [GET]/user/logout
module.exports.logout = (req, res) => {
    res.clearCookie("tokenUser");
    res.clearCookie("cartId");

    res.redirect("/");
}

// [GET]/user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    res.render('client/pages/user/forgot-password', {
        pageTitle: "Lấy lại mật khẩu"
    });
}

// [GET]/user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;

    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if (!user) {
        req.flash('error', "Email không tồn tại!");
        const currentUrl = req.get('Referrer');
        res.redirect(currentUrl);
        return;
    }

    const otp = generateHelper.generateRandomNumber(6);

    const objectForgotPassword = {
        email: email,
        otp: otp,
        expriresAt: Date.now()
    }

    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `
    Mã OTP xác minh lấy lại mật khẩu: <b>${otp}</b>. Thời hạn sử dụng là 3 phút.
    `;
    sendMailHelper.sendMail(email, subject, html);

    res.redirect(`/user/password/otp?email=${email}`);
}

// [GET]/user/password/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.query.email;

    res.render('client/pages/user/otp-password', {
        pageTitle: "Nhập mã OTP",
        email: email
    });
}

// [POST]/user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
    const otp = req.body.otp;
    const email = req.body.email;

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });

    if (!result) {
        req.flash('error', "Mã OTP không hợp lệ");
        const currentUrl = req.get('Referrer');
        res.redirect(currentUrl);
        return;
    }

    const user = await User.findOne({
        email: email
    });

    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/user/password/reset");
}

// [GET]/user/password/reset
module.exports.resetPassword = async (req, res) => {
    const email = req.query.email;

    res.render('client/pages/user/reset-password', {
        pageTitle: "Đổi mật khẩu",
        email: email
    });
}

// [POST]/user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;

    await User.updateOne({
        tokenUser: tokenUser
    }, {
        password: md5(password)
    });

    req.flash('success', "Đổi mật khẩu thành công!");
    res.redirect("/");
}

// [GET]/user/info
module.exports.info = async (req, res) => {
    res.render('client/pages/user/info', {
        pageTitle: "Thông tin tài khoản"
    });
}

// [GET]/user/edit
module.exports.edit = async (req, res) => {
    res.render('client/pages/user/edit', {
        pageTitle: "Chỉnh sửa thông tin"
    });
}

// [POST]/user/editPatch
module.exports.editPatch = async (req, res) => {
    try {
        await User.updateOne({ tokenUser: req.cookies.tokenUser 

        }, {
            fullName, phone, avatar
        });
        req.flash('success', "Cập nhật tài khoản thành công!");
    } catch (error) {
        req.flash('error', "Cập nhật tài khoản thất bại!");
    }

    const currentUrl = req.get('Referrer');
    res.redirect(currentUrl);
}