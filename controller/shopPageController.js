const categoryCollection = require("../models/categoryModel");
const productCollection = require("../models/productModels");

module.exports = {
  //shop page
  shopPage: async (req, res) => {
    try {
      let categoryData = await categoryCollection.find();
      let productData =
        req.session?.shopProductData || (await productCollection.find());
      res.render("userViews/shop", { categoryData, productData });
      req.session.shopProductData = null;
    } catch (error) {
      console.error(error);
    }
  },
  filterCategory: async (req, res) => {
    try {
      req.session.shopProductData = await productCollection.find({
        parentCategory: req.params.categoryName,
      });
      res.redirect("/shop");
    } catch (error) {
      console.error(error);
    }
  },
  filterPriceRange: async (req, res) => {
    try {
      req.session.shopProductData = await productCollection.find({
        productPrice: {
          $gt: 0 + 500 * req.query.priceRange,
          $lte: 500 + 500 * req.query.priceRange,
        },
      });
      res.redirect("/shop");
    } catch (error) {
      console.error(error);
    }
  },
  sortPriceRangeAscending: async (req, res) => {
    try {
        req.session.shopProductData = await productCollection.find().sort({ productPrice: 1 });
        res.redirect("/shop");
      } catch (error) {
        console.error(error);
      }
  },
  sortPriceRangeDescending: async (req, res) => {
    try {
        req.session.shopProductData = await productCollection.find().sort({ productPrice: -1 });
        res.redirect("/shop");
      } catch (error) {
        console.error(error);
      }
  }
};
