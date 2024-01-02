const addressCollection = require("../models/addressModel.js");
const cartCollection = require("../models/cartModel.js");
const orderCollection = require("../models/orderModel.js");

module.exports = {
  //cart
  cart: async (req, res) => {
    try {
      let userCartData = await cartCollection
        .find({ userId: req.session.currentUser._id })
        .populate("productId");
      let grandTotal = 0;
      if (userCartData) {
        for (const v of userCartData) {
          grandTotal += v.productId.productPrice * v.productId.productQuantity;
          try {
            await cartCollection.updateOne(
              { _id: v._id },
              {
                $set: {
                  totaCostPerProduct:
                    v.productId.productPrice * v.productId.productQuantity,
                },
              }
            );
          } catch (error) {
            console.error("Error updating document:", error);
          }
        }
      }
      userCartData = await cartCollection
        .find({ userId: req.session.currentUser._id })
        .populate("productId");
      req.session.grandTotal = grandTotal;
      res.render("userViews/cart", {
        currentUser: req.session.currentUser,
        userCartData,
        grandTotal,
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
        await cartCollection.updateOne({ $inc: { productQuantity: 1 } });
      else
        await cartCollection.insertMany([
          {
            userId: req.session.currentUser._id,
            productId: req.params.id,
            productQuantity: req.body.productQuantity,
          },
        ]);
      res.redirect("back");
    } catch (error) {
      console.log(error);
    }
  },
  deleteFromCart: async (req, res) => {
    await cartCollection.findOneAndUpdate(
      { userId: req.session.currentUser._id },
      { $pull: { cartProducts: { productId: req.params.id } } }
    );
    res.redirect("back");
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
      console.log(req.query);
      req.session.chosenAddress = req.query.chosenAddress;
      res.render("userViews/checkoutPage2", {
        grandTotal: req.session.grandTotal,
      });
    } catch (error) {
      console.error(error);
    }
  },
  orderPlaced: async (req, res) => {
    try {
      let cartData = await cartCollection
        .find({ userId: req.session.currentUser._id })
        .populate("productId"); ////check this again ffs
      console.log("cart data ===>", cartData);
      let orderNumber = Math.trunc(Math.random() * 10000);
      await orderCollection.insertMany({
        userId: req.session.currentUser._id,
        orderNumber,
        addressChosen: req.session.chosenAddress,
        cartData,
        grandTotalCost: req.session.grandTotal,
      });
      let orderData = await orderCollection.findOne({ orderNumber });
      console.log("order data ===>", orderData);
      res.render("userViews/orderPlacedPage", {
        orderCartData: cartData,
        orderNumber,
      }); ////check this again ffs
    } catch (error) {
      console.error(error);
    }
  },
};
