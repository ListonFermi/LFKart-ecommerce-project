const addressCollection = require("../models/addressModel.js");
const cartCollection = require("../models/cartModel.js");
const orderCollection = require("../models/orderModel.js");
const paypalCreateOrder = require("../services/paypalCreateOrder.js");
const razorpay = require("../services/razorpay.js");

//updating totalCostPerProduct and grand total in cart-page
async function grandTotal(req) {
  try {
    console.log('session'+req.session.currentUser);
    let userCartData = await cartCollection
      .find({ userId: req.session.currentUser._id })
      .populate("productId");
    console.log(Array.isArray(userCartData));
    let grandTotal = 0;
    for (const v of userCartData) {
      grandTotal += v.productId.productPrice * v.productQuantity;
      await cartCollection.updateOne(
        { _id: v._id },
        {
          $set: {
            totalCostPerProduct: v.productId.productPrice * v.productQuantity,
          },
        }
      );
    }
    userCartData = await cartCollection
      .find({ userId: req.session.currentUser._id })
      .populate("productId");
    req.session.grandTotal = grandTotal;

    return userCartData;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  //cart
  cart: async (req, res) => {
    try {
      let userCartData = await grandTotal(req);
      res.render("userViews/cart", {
        currentUser: req.session.currentUser,
        userCartData,
        grandTotal: req.session.grandTotal,
      });
    } catch (error) {
      console.error(error);
    }
  },
  addToCart: async (req, res) => {
    try {
      let existingProduct = await cartCollection.findOne({
        userId: req.session.currentUser._id,
        productId: req.params.id,
      });
      if (existingProduct)
        await cartCollection.updateOne(
          { _id: existingProduct._id },
          { $inc: { productQuantity: 1 } }
        );
      else
        await cartCollection.insertMany([
          {
            userId: req.session.currentUser._id,
            productId: req.params.id,
            productQuantity: req.body.productQuantity,
          },
        ]);
      console.log(req.body);
      res.redirect("back");
    } catch (error) {
      console.log(error);
    }
  },
  //cart-page
  deleteFromCart: async (req, res) => {
    try {
      await cartCollection.findOneAndDelete({ _id: req.params.id });
      res.send("hello ur cart is deleted");
    } catch (error) {
      console.error(error);
    }
  },
  decQty: async (req, res) => {
    try {
      let cartProduct = await cartCollection
        .findOne({ _id: req.params.id })
        .populate("productId");
      if (cartProduct.productQuantity > 1) {
        cartProduct.productQuantity--;
      }
      cartProduct = await cartProduct.save();
      await grandTotal(req);
      res.json({ cartProduct, grandTotal: req.session.grandTotal });
    } catch (error) {
      console.error(error);
    }
  },
  incQty: async (req, res) => {
    try {
      let cartProduct = await cartCollection
        .findOne({ _id: req.params.id })
        .populate("productId");
      if (cartProduct.productQuantity < cartProduct.productId.productStock) {
        cartProduct.productQuantity++;
      }
      cartProduct = await cartProduct.save();
      await grandTotal(req);
      res.json({ cartProduct, grandTotal: req.session.grandTotal });
    } catch (error) {
      console.error(error);
    }
  },
  //checkout
  checkoutPage1: async (req, res) => {
    try {
      let addressData = await addressCollection.find({
        userId: req.session.currentUser._id,
      });
      console.log(addressData);
      res.render("userViews/checkoutPage1", {
        grandTotal: req.session.grandTotal,
        addressData,
      });
    } catch (error) {
      console.error(error);
    }
  },
  checkoutPage2: async (req, res) => {
    try {
      let cartData = await cartCollection.find({ userId: req.session.currentUser._id }).populate("productId");
      cartData = JSON.parse(JSON.stringify(cartData));
      await orderCollection.create({
        userId: req.session.currentUser._id,
        orderNumber: (await orderCollection.countDocuments()) + 1,
        orderDate: new Date().toLocaleString(),
        cartData,
        addressChosen: req.query.chosenAddress,
        grandTotalCost: req.session.grandTotal,
      });
      res.render("userViews/checkoutPage2", { grandTotal: req.session.grandTotal });
    } catch (error) {
      console.error(error);
    }
  },
  //razorpay
  razorpayCreateOrderId: async (req, res) => {
    var options = {
      amount: req.session.grandTotal+'00', // amount in the smallest currency unit
      currency: "INR",
      receipt: "order_rcptid_11",
    };
    razorpay.instance.orders.create(options, function (err, order) {
      console.log(order);
    });
  },

  orderPlaced: async (req, res) => {
    try {
      let cartData = await cartCollection
        .find({ userId: req.session.currentUser._id })
        .populate("productId");
      //delete the cart- since the order is placed
      await cartCollection.deleteMany({
        userId: req.session.currentUser._id,
      });
      res.render("userViews/orderPlacedPage", {
        orderCartData: cartData,
        orderData,
      });
    } catch (error) {
      console.error(error);
    }
  },
};
