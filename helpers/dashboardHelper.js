const categoryCollection = require("../models/categoryModel.js");
const orderCollection = require("../models/orderModel");
const productCollection = require("../models/productModels.js");

module.exports = {
  productsCount: async () => {
    try {
      return await productCollection.countDocuments();
    } catch (error) {
      console.error(error);
    }
  },

  categoryCount: async () => {
    try {
      return await categoryCollection.countDocuments();
    } catch (error) {
      console.error(error);
    }
  },

  pendingOrdersCount: async () => {
    try {
      return await orderCollection.countDocuments({
        orderStatus: { $ne: "Delivered" },
      });
    } catch (error) {
      console.error(error);
    }
  },

  completedOrdersCount: async () => {
    try {
      return await orderCollection.countDocuments({ orderStatus: "Delivered" });
    } catch (error) {
      console.error(error);
    }
  },

  currentDayRevenue: async () => {
    try {
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      const result = await orderCollection.aggregate([
        { $match: { orderDate: { $gte: yesterday, $lt: today } } },
        { $group: { _id: "", totalRevenue: { $sum: "$grandTotalCost" } } },
      ]);
      return result.length>0?result[0].totalRevenue: 0;
    } catch (error) {
      console.error(error);
    }
  },

  fourteenDaysRevenue: async () => {
    try {
      const result = await orderCollection.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } },
            dailyRevenue: { $sum: "$grandTotalCost" },
          },
        },
        {
          $sort: { _id: 1 },
        },
        {
          $limit: 14,
        },
      ]);
      return {
        date: result.map((v) => v._id),
        revenue: result.map((v) => v.dailyRevenue),
      };
    } catch (error) {
      console.error(error);
    }
  },

  categoryWiseRevenue: async () => {
    try {
      const result = await orderCollection.aggregate([
        { $unwind: "$cartData" },
        {
          $group: {
            _id: "$cartData.productId.parentCategory",
            revenuePerCategory: { $sum: "$cartData.totalCostPerProduct" },
          },
        },
      ]);

      return {
        categoryName: result.map((v) => v._id),
        revenuePerCategory: result.map((v) => v.revenuePerCategory),
      };
    } catch (error) {
      console.error(error);
    }
  },
};
