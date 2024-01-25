const categoryCollection = require("../models/categoryModel");
const productCollection = require("../models/productModels");

module.exports = {
  //shop page
  shopPage: async (req, res) => {
    try {
      let categoryData = await categoryCollection.find({isListed: true});

      let productsInOnePage = 9
      let pageNo = req.query.pageNo ||  1
      let skip= (pageNo-1) * productsInOnePage 
      let limit= productsInOnePage
      let productDataWithPagination= await productCollection.find({ isListed: true }).skip(skip).limit(limit)
      
      let productData =
        req.session?.shopProductData || productDataWithPagination;

      let totalPages=  Math.ceil(  await productCollection.countDocuments() / productsInOnePage )
      console.log(totalPages);
      let totalPagesArray = new Array(totalPages).fill(null)

      res.render("userViews/shop", { categoryData, productData, totalPagesArray });
      req.session.shopProductData = null;
    } catch (error) {
      console.error(error);
    }
  },
  filterCategory: async (req, res) => {
    try {
      req.session.shopProductData = await productCollection.find({
        isListed: true,
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
        isListed: true,
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
  sortPriceAscending: async (req, res) => {
    try {
      req.session.shopProductData = await productCollection
        .find({ isListed: true })
        .sort({ productPrice: 1 });
      res.json({ success: true });
    } catch (error) {
      console.error(error);
    }
  },
  sortPriceDescending: async (req, res) => {
    try {
      req.session.shopProductData = await productCollection
        .find({ isListed: true })
        .sort({ productPrice: -1 });
      res.json({ success: true });
    } catch (error) {
      console.error(error);
    }
  },
};
