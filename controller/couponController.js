const couponCollection = require("../models/couponModel");
const formatDate = require("../helpers/formatDateHelper.js");

module.exports = {
  couponManagement: async (req, res) => {
    try {
      let couponData = await couponCollection.find();
      couponData = couponData.map((v) => {
        v.startDateFormatted = formatDate(v.startDate, "YYYY-MM-DD");
        v.expiryDateFormatted = formatDate(v.expiryDate, "YYYY-MM-DD");
        return v;
      });
      res.render("adminViews/couponManagement", { couponData });
    } catch (error) {
      console.error(error);
    }
  },
  addCoupon: async (req, res) => {
    try {
      let existingCoupon = await couponCollection.findOne({
        couponCode:{ $regex: new RegExp(req.body.couponCode, "i") }
      });
      if (!existingCoupon) {
        await couponCollection.insertMany([
          {
            couponCode: req.body.couponCode,
            discountPercentage: req.body.discountPercentage,
            startDate: new Date(req.body.startDate),
            expiryDate: new Date(req.body.expiryDate),
            minimumPurchase: req.body.minimumPurchase,
            maximumDiscount: req.body.maximumDiscount,
          },
        ]);
        res.json({ couponAdded: true });
      } else {
        res.json({ couponCodeExists: true });
      }
    } catch (error) {
      console.error(error);
    }
  },
  editCoupon: async (req, res) => {
    try {
      let existingCoupon = await couponCollection.findOne({
        couponCode: { $regex: new RegExp(req.body.couponCode, "i") },
      });
      if (!existingCoupon || existingCoupon._id == req.params.id) {
        let updateFields = {
          couponCode: req.body.couponCode,
          discountPercentage: req.body.discountPercentage,
          startDate: new Date(req.body.startDate),
          expiryDate: new Date(req.body.expiryDate),
          minimumPurchase: req.body.minimumPurchase,
          maximumDiscount: req.body.maximumDiscount,
        };
        await couponCollection.findOneAndUpdate( { _id: req.params.id },  { $set: updateFields }  );
        res.json({ couponEdited: true });
      } else {
        res.json({ couponCodeExists: true });
      }
    } catch (error) {
      console.error(error);
    }
  },
};
