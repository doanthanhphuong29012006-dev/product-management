const Product = require('../../models/product.model');

const productHelper = require('../../helpers/product');

// [GET] /
module.exports.index = async (req, res) => {
    const productsFeatured = await Product.find({
        deleted: false,
        feature: "1",
        status: "active"
    }).limit(8);

    const newProductsFeatured = productHelper.newProductPrice(productsFeatured);

    const newProducts = await Product.find({
        deleted: false,
        status: "active"
    }).sort({ position: "desc" })
    .limit(8);

    const newProductsNew = productHelper.newProductPrice(newProducts);

    res.render('client/pages/home/index', {
        pageTitle: "Trang chủ",
        productsFeatured: newProductsFeatured,
        newProducts: newProductsNew
    });
};