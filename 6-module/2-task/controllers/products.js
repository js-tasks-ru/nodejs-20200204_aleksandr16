const mongoose = require('mongoose');
const Product = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const subcategory = ctx.request.query.subcategory;
  if (!!subcategory) {
    const productsBySubcategory = await Product.find({subcategory});
    ctx.products = {products: productsBySubcategory};
  } else {
    const products = await Product.find({});
    ctx.products = {products};
  }
  ctx.body = ctx.products;
  next();
};

module.exports.productList = async function productList(ctx, next) {
  ctx.body = ctx.products;
  next();
};

module.exports.productById = async function productById(ctx, next) {
  if (!mongoose.isValidObjectId(ctx.params.id)) {
    ctx.throw(400);
  } else {
    const id = new mongoose.Types.ObjectId(ctx.params.id);
    const product = await Product.findOne(id);

    if (!product) {
      ctx.throw(404);
    }

    ctx.body = {product};
  }
  next();
};
