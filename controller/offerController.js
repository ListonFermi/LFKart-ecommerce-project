const productCollection = require("../models/productModels");
const productOfferCollection = require("../models/productOfferModel");
const formatDate = require("../helpers/formatDateHelper.js");

module.exports = {
  productOfferManagement: async (req, res) => {
    try {
      let productData = await productCollection.find();
      let productOfferData = await productOfferCollection.find();
      productOfferData = productOfferData.map((v) => {
        v.startDateFormatted = formatDate(v.startDate, "YYYY-MM-DD");
        v.endDateFormatted = formatDate(v.endDate, "YYYY-MM-DD");
        v.currentStatus = v.endDate > new Date();
        return v;
      });
      console.log(productOfferData);
      res.render("adminViews/productOfferManagement", {
        productData,
        productOfferData,
      });
    } catch (error) {
      console.error(error);
    }
  },
  addOffer: async (req, res) => {
    try {
      console.log(req.body);
      let { productName } = req.body;
      let existingOffer = await productOfferCollection.findOne({
        productName: { $regex: new RegExp(productName, "i") },
      });

      if (!existingOffer) {
        let productData = await productCollection.findOne({ productName });
        let productId = productData._id;

        let { productOfferPercentage, startDate, endDate } = req.body;
        await productOfferCollection.insertMany([
          {
            productId,
            productName,
            productOfferPercentage,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
          },
        ]);
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
      let { productName } =req.body
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

        await productOfferCollection.findOneAndUpdate(
          { _id: req.params.id },
          { $set: updateFields }
        );
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    } catch (error) {
      console.error(error);
    }
  },
};
