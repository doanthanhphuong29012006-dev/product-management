const Product  = require('../../models/product.model');
const ProductCategory  = require('../../models/product-category.model');

const productHelper = require('../../helpers/product');
const productCategoryHelper = require('../../helpers/product-category');
const { all } = require('../../routes/client/product.route');

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    })
    .sort({ position: "desc" });

    const newProducts = productHelper.newProductPrice(products);

    res.render('client/pages/products/index', {
        pageTitle: "Danh sách sản phẩm",
        products: newProducts
    });
};

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            slug: req.params.slug,
            status: "active"
        }

        const product = await Product.findOne(find);

        res.render('client/pages/products/detail', {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        req.flash('error', "Không tồn tại sản phẩm này!");
        res.redirect("/products")
    }
};

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
    const category = await ProductCategory.findOne({
        deleted: false,
        slug: req.params.slugCategory
    });

    const listSubCategory = await productCategoryHelper.getSubCategory(category.id);
    const listSubCategoryId = listSubCategory.map(item => item.id);

    const products = await Product.find({
        deleted: false,
        product_category_id: { $in: [category.id, ...listSubCategoryId] }
    }).sort({ position: "desc" });

    const newProducts = productHelper.newProductPrice(products);

    res.render('client/pages/products/index', {
        pageTitle: category.title,
        products: newProducts
    });
};