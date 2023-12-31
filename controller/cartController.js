const addressCollection = require("../models/addressModel.js");
const cartCollection = require("../models/cartModel.js");
const orderCollection = require("../models/orderModel.js");
const paypalCreateOrder = require("../services/paypalCreateOrder.js");

//updating totalCostPerProduct and grand total in cart-page
async function grandTotal(req) {
  try {
    let userCartData = await cartCollection
      .find({ userId: req.session.currentUser._id })
      .populate("productId");
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
      console.log(userCartData);
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
      console.log(req.query);
      req.session.chosenAddress = req.query.chosenAddress;
      res.render("userViews/checkoutPage2", {
        grandTotal: req.session.grandTotal,
        paypalClientId: process.env.CLIENT_ID,
      });
    } catch (error) {
      console.error(error);
    }
  },
  //create paypal order
  paypalPay: async (req, res) => {
    try {
      const create_payment_json = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url: "http://localhost:3000/success",
          cancel_url: "http://localhost:3000/cancel",
        },
        transactions: [
          {
            item_list: {
              items: [
                {
                  name: "Red Sox Hat",
                  sku: "001",
                  price: "25.00",
                  currency: "USD",
                  quantity: 1,
                },
              ],
            },
            amount: {
              currency: "USD",
              total: "25.00",
            },
            description: "Hat for the best team ever",
          },
        ],
      };
      res.json(order);
    } catch (error) {
      console.log(error);
    }
  },
  orderPlaced: async (req, res) => {
    try {
      let cartData = await cartCollection
        .find({ userId: req.session.currentUser._id })
        .populate("productId");
      cartData = JSON.parse(JSON.stringify(cartData));
      let addressChosen = await addressCollection.findOne({
        _id: req.session.chosenAddress,
      });
      let orderData = await orderCollection.create({
        userId: req.session.currentUser._id,
        orderNumber: (await orderCollection.countDocuments()) + 1,
        orderDate: new Date().toLocaleString(),
        cartData,
        addressChosen,
        grandTotalCost: req.session.grandTotal,
      });
      console.log("deleting", req.session.currentUser._id);

      let dc = await cartCollection.deleteMany({
        userId: req.session.currentUser._id,
      });
      console.log(dc);
      res.render("userViews/orderPlacedPage", {
        orderCartData: cartData,
        orderData,
      });
    } catch (error) {
      console.error(error);
    }
  },
};
