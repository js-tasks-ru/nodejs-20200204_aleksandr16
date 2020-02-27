const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categoriesRaw = await Category.find({});
  const categories = categoriesRaw.map((category) => {
    return {
      id: category._id,
      title: category.title,
      subcategories: category.subcategories.map((subcategory) => {
        return {
          id: subcategory._id,
          title: subcategory.title,
        };
      }),
    };
  });
  ctx.body = {categories};
  next();
};
