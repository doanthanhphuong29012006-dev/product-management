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
        return
    }

    req.body.password = md5(req.body.password);

    const user = new User(req.body);
    user.save();

    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/");
}