const categoryCollection = require("../models/categoryModel.js");
const productCollection = require("../models/productModels.js");

module.exports = {
  categoryManagement: async (req, res) => {
    try {
      let categoryData = await categoryCollection.find();
      res.render("adminViews/categoryManagement", {
        categoryData,
        categoryExists: req.session.categoryExists,
      });
      req.session.categoryExists = null;
    } catch (error) {
      console.error(error);
    }
  },
  addCategory: async (req, res) => {
    try {
      let categoryExists = await categoryCollection.findOne({
        categoryName: { $regex: new RegExp(req.body.categoryName, "i") },
      });
      console.log(categoryExists);
      console.log(req.body);
      if (!categoryExists) {
        new categoryCollection({
          categoryName: req.body.categoryName,
          categoryDescription: req.body.categoryDescription,
        }).save();

        res.redirect("/admin/categoryManagement");
      } else {
        req.session.categoryExists = categoryExists;
        res.redirect("/admin/categoryManagement");
      }
    } catch (error) {
      console.error(error);
    }
  },
  unlistCategory: async (req, res) => {
    try {
      await categoryCollection.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { isListed: false } }
      );
      res.status(200).json({success: true})
    } catch (error) {
      console.error(error);
    }
  },
  listCategory: async (req, res) => {
    try {
      await categoryCollection.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { isListed: true } }
      );
      res.status(200).json({success: true})
    } catch (error) {
      console.error(error);
    }
  },
  editCategory: async (req, res) => {
    try {
      let existingCategory = await categoryCollection.findOne({
        categoryName: { $regex: new RegExp(req.body.categoryName, "i") },
      });
      console.log(existingCategory);
      if (!existingCategory || existingCategory._id == req.params.id) {
        await categoryCollection.findOneAndUpdate(
          {
            _id: req.params.id,
          },
          {
            $set: {
              categoryName: req.body.categoryName,
              categoryDescription: req.body.categoryDescription,
            },
          }
        );
        res.redirect("/admin/categoryManagement");
      } else {
        req.session.categoryExists = existingCategory;
        res.redirect("/admin/categoryManagement");
      }
    } catch (error) {
      console.error(error);
    }
  },
  deleteCategory: async (req, res) => {
    try {
      await categoryCollection.findOneAndDelete({ _id: req.params.id });
      res.redirect("/admin/categoryManagement");
    } catch (error) {
      console.error(error);
    }
  },
};
