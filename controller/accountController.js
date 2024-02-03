const addressCollection = require("../models/addressModel");
const orderCollection = require("../models/orderModel");
const bcrypt = require("bcrypt");
const userCollection = require("../models/userModels");
const formatDate = require("../helpers/formatDateHelper.js");
const { generateInvoice } = require("../services/generatePDF.js");

module.exports = {
  //account
  accountPage: async (req, res) => {
    try {
      let userData = await userCollection.findOne({
        _id: req.session.currentUser._id,
      });
      res.render("userViews/account", {
        currentUser: req.session.currentUser,
        userData,
      });
    } catch (error) {
      console.error(error);
    }
  },
  //account-orderList
  orderList: async (req, res) => {
    try {
      let orderData = await orderCollection.find({
        userId: req.session.currentUser._id,
      });

      //sending the formatted date to the page
      orderData = orderData.map((v) => {
        v.orderDateFormatted = formatDate(v.orderDate);
        return v;
      });

      res.render("userViews/orderList", { currentUser: req.session.currentUser , orderData });
    } catch (error) {
      console.error(error);
    }
  },
  orderStatus: async (req, res) => {
    try {
      let orderData = await orderCollection
        .findOne({ _id: req.params.id })
        .populate("addressChosen");
      let isCancelled = orderData.orderStatus == "Cancelled";
      res.render("userViews/orderStatus", { currentUser: req.session.currentUser , orderData, isCancelled });
    } catch (error) {
      console.error(error);
    }
  },

  cancelOrder: async (req, res) => {
    try {
      const orderData = await orderCollection.findOne({ _id: req.params.id });

      await orderCollection.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: { orderStatus: "Cancelled" } }
      );

      console.log(
        await userCollection.findByIdAndUpdate(
          { _id: req.session.currentUser._id },
          { $inc: { wallet: orderData.grandTotalCost } }
        )
      );
      res.json({ success: true });
    } catch (error) {
      console.error(error);
    }
  },
  downloadInvoice: async (req, res) => {
    try {
      let orderData = await orderCollection.findOne({ _id: req.params.id }).populate('addressChosen');

      const stream = res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment;filename=invoice.pdf",
      });

      generateInvoice(
        (chunk) => stream.write(chunk),
        () => stream.end(),
        orderData
      );
    } catch (error) {
      console.error(error);
    }
  },

  myAddress: async (req, res) => {
    try {
      const addressData = await addressCollection.find({
        userId: req.session.currentUser._id,
      });
      res.render("userViews/myAddress", {
        currentUser: req.session.currentUser,
        addressData,
      });
    } catch (error) {
      console.error(error);
    }
  },
  addAddress: async (req, res) => {
    try {
      res.render("userViews/addAddress", {
        currentUser: req.session.currentUser,
      });
    } catch (error) {
      console.error(error);
    }
  },
  addAddressPost: async (req, res) => {
    try {
      const address = {
        userId: req.session.currentUser._id,
        addressTitle: req.body.addressTitle,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        addressLine1: req.body.addressLine1,
        addressLine2: req.body.addressLine2,
        phone: req.body.phone,
      };
      await addressCollection.insertMany([address]);

      if(req.session.addressPageFrom == 'cart'){
        req.session.addressPageFrom =null
        return res.redirect('/cart')
      }
      
      return res.redirect("/account");
    } catch (error) {
      console.error(error);
    }
  },
  editAddress: async (req, res) => {
    try {
      const existingAddress = await addressCollection.findOne({
        userId: req.session.currentUser._id,
        _id: req.params.id,
      });
      console.log(existingAddress);
      res.render("userViews/editAddress", {
        currentUser: req.session.currentUser,
        existingAddress,
      });
    } catch (error) {
      console.error(error);
    }
  },
  editAddressPost: async (req, res) => {
    try {
      const address = {
        addressTitle: req.body.addressTitle,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        addressLine1: req.body.addressLine1,
        addressLine2: req.body.addressLine2,
        phone: req.body.phone,
      };
      await addressCollection.updateOne({ _id: req.params.id }, address);

      res.redirect("back");
    } catch (error) {
      console.error(error);
    }
  },
  deleteAddress: async (req, res) => {
    try {
      await addressCollection.deleteOne({ _id: req.params.id });
      res.redirect("/account/myAddress");
    } catch (error) {
      console.log(error);
    }
  },

  //personal info
  changePassword: async (req, res) => {
    try {
      res.render("userViews/changePassword", {
        invalidCurrentPassword: req.session.invalidCurrentPassword,
      });
    } catch (error) {
      console.error(error);
    }
  },
  changePasswordPatch: async (req, res) => {
    try {
      console.log(req.body, req.session.currentUser);
      const compareCurrentPass = bcrypt.compareSync(
        req.body.currentPassword,
        req.session.currentUser.password
      );
      if (compareCurrentPass) {
        const encryptedNewPassword = bcrypt.hashSync(
          req.body.currentPassword,
          10
        );
        await userCollection.updateOne(
          { _id: req.session.currentUser._id },
          { $set: { password: encryptedNewPassword } }
        );
        res.json({ success: true });
      } else {
        req.session.invalidCurrentPassword = true;
        res.json({ success: false });
      }
    } catch (error) {
      console.error(error);
    }
  },
};
