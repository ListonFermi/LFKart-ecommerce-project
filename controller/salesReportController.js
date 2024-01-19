const orderCollection = require("../models/orderModel");
const formatDate= require('../helpers/formatDateHelper.js')

const { ObjectId } = require('mongodb');


module.exports = {
  salesReport: async (req, res) => {
    try {
      let salesData = await orderCollection.find().populate("userId");

      salesData = salesData.map(v => {
        v.orderDateFormatted = formatDate(v.orderDate);
        return v;
      });

      res.render("adminViews/salesReport", { salesData });
    } catch (error) {
      console.error("Error fetching sales data:", error);
      res.status(500).send("Internal Server Error");
    }
  },
};


