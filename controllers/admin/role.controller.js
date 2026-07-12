const Role = require('../../models/role.model');
const systemConfig = require('../../config/system');

module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await Role.find(find);

    res.render('admin/pages/roles/index', {
        pageTitle: "Nhóm quyền",
        records: records
    });
}

module.exports.create = async (req, res) => {
    res.render('admin/pages/roles/create', {
        pageTitle: "Thêm mới nhóm quyền"
    });
}

module.exports.createPost = async (req, res) => {
    const record = new Role(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/roles`)
}

