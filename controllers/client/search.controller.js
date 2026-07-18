const Product = require('../../models/product.model');

const productHelper = require('../../helpers/product');

// [GET] /search
module.exports.index = async (req, res) => {
    const  keyword = req.query.keyword;

    let newProducts = [];

    if (keyword) {
        const regex = new RegExp(keyword, "i");
        const products = await Product.find({
            deleted: false,
            status: "active",
            title: regex
        });

        newProducts = productHelper.newProductsPrice(products);
    }

    res.render('client/pages/search/index', {
        pageTitle: "Kết quả tìm kiếm",
        keyword: keyword,
        products: newProducts
    });
}