const orderCollection = require("../models/orderModel");
const formatDate = require("../helpers/formatDateHelper.js");
const exceljs = require("exceljs");

const { ObjectId } = require("mongodb");

module.exports = {
  salesReport: async (req, res) => {
    try {
      let salesData = await orderCollection.find().populate("userId");

      salesData = salesData.map((v) => {
        v.orderDateFormatted = formatDate(v.orderDate);
        return v;
      });

      res.render("adminViews/salesReport", { salesData });
    } catch (error) {
      console.error("Error fetching sales data:", error);
      res.status(500).send("Internal Server Error");
    }
  },
  salesReportDownload: async (req, res) => {
    try {
      const workBook = new exceljs.Workbook();
      const sheet = workBook.addWorksheet("book");
      sheet.columns = [
        { header: "No", key: "no", width: 10 },
        { header: "Username", key: "username", width: 25 },
        { header: "Order Date", key: "orderDate", width: 25 },
        { header: "Products", key: "products", width: 35 },
        { header: "No of items", key: "noOfItems", width: 35 },
        { header: "Total Cost", key: "totalCost", width: 25 },
        { header: "Payment Method", key: "paymentMethod", width: 25 },
        { header: "Status", key: "status", width: 20 },
      ];

      let salesData = await orderCollection.find().populate("userId");

      salesData = salesData.map((v) => {
        v.orderDateFormatted = formatDate(v.orderDate);
        return v;
      });

      salesData.map((v) => {
        sheet.addRow({
          no: v.orderNumber,
          username: v.userId.username,
          orderDate: v.orderDateFormatted,
          products: v.cartData.map((v) => v.productId.productName).join(", "),
          noOfItems: v.cartData.map((v) => v.productQuantity).join(", "),
          totalCost: "₹" + v.grandTotalCost,
          paymentMethod: v.paymentType,
          status: v.orderStatus,
        });
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=salesReport.xlsx"
      );

      workBook.xlsx.write(res);
    } catch (error) {
      console.log(error);
    }
  },
};
