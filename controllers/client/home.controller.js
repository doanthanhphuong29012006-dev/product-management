const Product = require('../../models/product.model');

const productHelper = require('../../helpers/product');

// [GET] /
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
        feature: "1",
        status: "active"
    };

    const productsFeatured = await Product.find(find).limit(6);

    const newProducts = productHelper.newProductPrice(productsFeatured);

    res.render('client/pages/home/index', {
        pageTitle: "Trang chủ",
        productsFeatured: newProducts
    });
};