const md5 = require('md5');
const Account = require('../../models/account.model');
const Role = require('../../models/role.model');
const systemConfig = require('../../config/system');

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await Account.find(find).select("-token -password");

    for (const record of records) {
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false,
        });
        record.role = role;
    }

    res.render('admin/pages/accounts/index', {
        pageTitle: "Danh sách tài khoản",
        records: records
    });
};

// [GET]/admin/accounts/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }

    const roles = await Role.find(find);

    res.render('admin/pages/accounts/create', {
        pageTitle: "Tạo mới tài khoản",
        roles: roles
    });
}

// [POST]/admin/accounts/create
module.exports.createPost = async (req, res) => {
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted: false
    });

    if (emailExist) {
        req.flash('error', "Email này đã tồn tại!");

        const currentUrl = req.get('Referrer');
        res.redirect(currentUrl);
    } else {
        req.body.password = md5(req.body.password);

        const record = new Account(req.body);
        await record.save();

        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
}

// [GET]/admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }

        const data = await Account.findOne(find);

        const roles = await Role.find({
            deleted: false
        });

        res.render('admin/pages/accounts/edit', {
            pageTitle: "Chỉnh sửa tài khoản",
            data: data,
            roles: roles
        });
    } catch (error) {
        req.flash('error', "Không tồn tại tài khoản này!");
        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }
}

// [PATCH]/admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    const emailExist = await Account.findOne({
        _id: { $ne: id },
        email: req.body.email,
        deleted: false
    });

    if (emailExist) {
        req.flash('error', "Email này đã tồn tại!");

        const currentUrl = req.get('Referrer');
        res.redirect(currentUrl);
    } else {
        if (req.body.password) {
            req.body.password = md5(req.body.password);
        } else {
            delete req.body.password;
        }
        
        if (req.file) {
            req.body.avatar = `/uploads/${req.file.filename}`;
        }

        try {
            await Account.updateOne({ _id: req.params.id }, req.body);
            req.flash('success', "Cập nhật tài khoản thành công!");
        } catch (error) {
            req.flash('error', "Cập nhật tài khoản thất bại!");
        }

        const currentUrl = req.get('Referrer');
        res.redirect(currentUrl);
    }
}

// [PATCH]/admin/accounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    
    await Account.updateOne({ _id: id }, { status: status });
    
    req.flash('success', 'Cập nhật trạng thái thành công!');

    const currentUrl = req.get('Referrer');
    res.redirect(currentUrl);
}

// [DELETE] /admin/accounts/delete/:id
module.exports.deleteAccount = async (req, res) => {
    const id = req.params.id;
    
    await Account.updateOne({ _id: id }, { 
        deleted: true,
        deletedAt: new Date() 
    });

    req.flash('success', "Xóa tài khoản thành công!");
    
    const currentUrl = req.get('Referrer');
    res.redirect(currentUrl);
}