const ProductCategory = require('../../models/product-category.model');
const systemConfig = require('../../config/system');

const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');
const createTreeHelper = require('../../helpers/createTree');

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };

    const filterStatus = filterStatusHelper(req.query);

    if (req.query.status) {
        find.status = req.query.status;
    }

    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    //Pagination
    const countProducts = await ProductCategory.countDocuments(find);
    const objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItems: 4   
        },
        req.query, countProducts
    );
    //End Pagination

    //Sort
    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = "desc";
    }
    //End Sort

    const records = await ProductCategory.find(find)
    .sort(sort)

    const newRecords = createTreeHelper(records);

    res.render('admin/pages/products-category/index', {
        pageTitle: "Danh mục sản phẩm",
        records: newRecords,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword
    });
}

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    };

    const records = await ProductCategory.find(find);

    const newRecords = createTreeHelper(records);

    res.render('admin/pages/products-category/create', {
        pageTitle: "Tạo mới danh mục sản phẩm",
        records: newRecords
    });
}

// [POST]/admin/products-category/create
module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position === "") {
        const count = await ProductCategory.countDocuments();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    const record = new ProductCategory(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
}

// [PATCH]/admin/products-category/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    
    await ProductCategory.updateOne({ _id: id }, { status: status });
    
    req.flash('success', 'Cập nhật trạng thái thành công!');

    const currentUrl = req.get('Referrer');
    res.redirect(currentUrl);
}

// [PATCH] /admin/products-category/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            await ProductCategory.updateMany({ _id: { $in: ids } }, { status: "active" });

            req.flash('success', `Cập nhật trạng thái ${ids.length} sản phẩm thành công!`);
            break;

        case "inactive":
            await ProductCategory.updateMany({ _id: { $in: ids } }, { status: "inactive" });

            req.flash('success', `Cập nhật trạng thái ${ids.length} sản phẩm thành công!`);
            break;

        case "delete-all":
            await ProductCategory.updateMany({ _id: { $in: ids } }, { 
                deleted: "true",
                deletedAt: new Date()
             });

            req.flash('success', `Đã xóa ${ids.length} sản phẩm thành công!`);
            break;

        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);

                await ProductCategory.updateOne({ _id: id }, { position: position });

                req.flash('success', `Đã đổi vị trí ${ids.length} sản phẩm thành công!`);
            }
            break;
    
        default:
            break;
    }

    const currentUrl = req.get("Referrer");
    res.redirect(currentUrl);
}

// [DELETE] /admin/products-category/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    
    await ProductCategory.updateOne({ _id: id }, { 
        deleted: true,
        deletedAt: new Date() 
    });

    req.flash('success', "Xóa sản phẩm thành công!");
    
    const currentUrl = req.get('Referrer');
    res.redirect(currentUrl);
}

// [GET]/admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }

        const records = await ProductCategory.find({
            deleted: false
        });

        const newRecords = createTreeHelper(records);

        const record = await ProductCategory.findOne(find);

        res.render('admin/pages/products-category/edit', {
            pageTitle: "Chỉnh sửa danh mục sản phẩm",
            record: record,
            records: newRecords
        });
    } catch (error) {
        req.flash('error', "Không tồn tại sản phẩm này!");
        res.redirect(`${systemConfig.prefixAdmin}/products-category`)
    }
}

// [PATCH]/admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
    req.body.position = parseInt(req.body.position);

    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    try {
        await ProductCategory.updateOne({ _id: req.params.id }, req.body);
        req.flash('success', "Cập nhật sản phẩm thành công!");
    } catch (error) {
        req.flash('error', "Cập nhật sản phẩm thất bại!");
    }

    const currentUrl = req.get('Referrer');
    res.redirect(currentUrl);
}

// [GET]/admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }

        const record = await ProductCategory.findOne(find);

        res.render('admin/pages/products/detail', {
            pageTitle: product.title,
            record: record
        });
    } catch (error) {
        req.flash('error', "Không tồn tại sản phẩm này!");
        res.redirect(`${systemConfig.prefixAdmin}/products-category`)
    }
}