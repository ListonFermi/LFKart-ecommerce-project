const productCollection = require("../models/productModels");
const categoryCollection = require("../models/categoryModel");
const productOfferCollection = require("../models/productOfferModel");
const formatDate = require("../helpers/formatDateHelper.js");
const applyProductOffers =
  require("../helpers/applyProductOffers.js").applyProductOffer;

module.exports = {
  productOfferManagement: async (req, res) => {
    try {
      // updating the currentStatus field by checking with the current date
      let productOfferData = await productOfferCollection.find();
      productOfferData.forEach(async (v) => {
        await productOfferCollection.updateOne(
          { _id: v._id },
          {
            $set: {
              currentStatus:
                v.endDate >= new Date() && v.startDate <= new Date(),
            },
          }
        );
      });

      //sending the formatted date to the page
      productOfferData = productOfferData.map((v) => {
        v.startDateFormatted = formatDate(v.startDate, "YYYY-MM-DD");
        v.endDateFormatted = formatDate(v.endDate, "YYYY-MM-DD");
        return v;
      });

      let productData = await productCollection.find();
      let categoryData = await categoryCollection.find();
      res.render("adminViews/productOfferManagement", {
        productData,
        productOfferData,
        categoryData,
      });
    } catch (error) {
      console.error(error);
    }
  },
  addOffer: async (req, res) => {
    try {
      //check if the product already has an offer applied
      let { productName } = req.body;
      let existingOffer = await productOfferCollection.findOne({ productName });

      if (!existingOffer) {
        //if offer for that particular product doesn't exist:
        let productData = await productCollection.findOne({ productName });

        let { productOfferPercentage, startDate, endDate } = req.body;
        await productOfferCollection.insertMany([
          {
            productId: productData._id,
            productName,
            productOfferPercentage,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
          },
        ]);
        await applyProductOffers("addOffer");
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    } catch (error) {
      console.error(error);
    }
  },
  editOffer: async (req, res) => {
    try {
      let { productName } = req.body;
      let existingOffer = await productOfferCollection.findOne({
        productName: { $regex: new RegExp(req.body.productName, "i") },
      });

      if (!existingOffer || existingOffer._id == req.params.id) {
        let { productId, productOfferPercentage, startDate, endDate } =
          req.body;

        let updateFields = {
          productId,
          productName,
          productOfferPercentage,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        };

        console.log(updateFields);

        await productOfferCollection.findOneAndUpdate(
          { _id: req.params.id },
          { $set: updateFields }
        );
        await applyProductOffers("editOffer");
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    } catch (error) {
      console.error(error);
    }
  },
  categoryOffer: async (req, res) => {
    try {
      console.log(req.body);
      let productData = await productCollection.find();
      let productsUnderSelectedCategory = productData.filter(
        (v) => v.parentCategory == req.body.categoryName
      );

      productsUnderSelectedCategory.forEach(async (v) => {
        let existingOffer = await productOfferCollection.findOne({
          productName: v.productName,
        });

        if (!existingOffer) {
          //if offer for that particular product doesn't exist:
          let productData = await productCollection.findOne({
            productName: v.productName,
          });

          let {
            categoryOfferPercentage,
            categoryOfferStartDate,
            categoryOfferEndDate,
          } = req.body;
          await productOfferCollection.insertMany([
            {
              productId: productData._id,
              productName: v.productName,
              productOfferPercentage: categoryOfferPercentage,
              startDate: new Date(categoryOfferStartDate),
              endDate: new Date(categoryOfferEndDate),
            },
          ]);
          
        } else {
          let {
            categoryOfferPercentage,
            categoryOfferStartDate,
            categoryOfferEndDate,
          } = req.body;

          let updateFields = {
            productId: v.id,
            productName: v.productName,
            productOfferPercentage: categoryOfferPercentage,
            startDate: new Date(categoryOfferStartDate),
            endDate: new Date(categoryOfferEndDate),
          };

          await productOfferCollection.findOneAndUpdate(
            { _id: req.params.id },
            { $set: updateFields }
          );
        }
      });

      res.json({ success: true });
    } catch (error) {
      console.error(error);
    }
  },
};
