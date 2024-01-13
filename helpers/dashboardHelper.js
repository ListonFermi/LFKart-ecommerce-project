const orderCollection = require("../models/orderModel");
const productCollection = require("../models/productModels.js");

module.exports = {
  productsCount: async () => await productCollection.countDocuments(),

  pendingOrdersCount: async () =>
    await orderCollection.countDocuments({ orderStatus: { $ne: "Delivered" } }),

  completedOrdersCount: async () =>
    await orderCollection.countDocuments({ orderStatus: "Delivered" }),

  currentDayRevenue: async (today, yesterday) =>{
    const result= await orderCollection.aggregate([
      { $match: { orderDate: { $gte: yesterday, $lt: today } } },
      { $group: { _id: "", totalRevenue: { $sum: "$grandTotalCost" } } },
    ])

    return result[0].totalRevenue
  },

  fourteenDaysRevenue: async () =>{
    const result= await orderCollection.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } },
          dailyRevenue: { $sum: "$grandTotalCost" },
        },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $limit: 14,
      },
    ])
    return { date: result.map( v=> v._id   ), revenue: result.map( v=> v.dailyRevenue   )  }
  }
};
