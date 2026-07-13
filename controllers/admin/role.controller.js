const Role = require('../../models/role.model');
const systemConfig = require('../../config/system');

// [GETT]/admin/roles
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

// [GET]/admin/roles/create
module.exports.create = async (req, res) => {
    res.render('admin/pages/roles/create', {
        pageTitle: "Thêm mới nhóm quyền"
    });
}

// [POST]/admin/roles/create
module.exports.createPost = async (req, res) => {
    const record = new Role(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/roles`)
}

// [GET]/admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        let find = {
            deleted: false,
            _id: id
        }

        const record = await Role.findOne(find);

        res.render('admin/pages/roles/edit', {
            pageTitle: "Chỉnh sửa nhóm quyền",
            record: record
        });
    } catch (error) {
        req.flash('error', "Không tồn tại nhóm quyền này!");
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
}

// [PATCH]/admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        await Role.updateOne({ _id: req.params.id }, req.body);
        req.flash('success', "Cập nhật nhóm quyền thành công!");
    } catch (error) {
        req.flash('error', "Cập nhật nhóm quyền thất bại!");
    }

    const currentUrl = req.get('Referer');
    res.redirect(currentUrl);
}

// [GET]/admin/roles/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;

        let find = {
            deleted: false,
            _id: id
        }

        const record = await Role.findOne(find);

        res.render('admin/pages/roles/detail', {
            pageTitle: "Chỉnh sửa nhóm quyền",
            record: record
        });
    } catch (error) {
        req.flash('error', "Không tồn tại nhóm quyền này!");
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
}

// [GET]/admin/roles/permissions
module.exports.permissions = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await Role.find(find);

    res.render('admin/pages/roles/permissions', {
        pageTitle: "Phân quyền",
        records: records
    });
}

// [PATCH]/admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
    try {
        const permissions = JSON.parse(req.body.permissions);
        for (const item of permissions) {
            await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
        }
        req.flash('success', "Cập nhật phân quyền thành công!");

        res.redirect(`${systemConfig.prefixAdmin}/roles/permissions`);
    } catch (error) {
        req.flash('error', "Cập nhật phân quyền thất bại!");
    }
}

