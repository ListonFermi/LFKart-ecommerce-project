const addressCollection = require("../models/addressModel.js");
const cartCollection = require("../models/cartModel.js");
const couponCollection = require("../models/couponModel.js");
const orderCollection = require("../models/orderModel.js");
const userCollection = require("../models/userModels.js");
const walletCollection = require("../models/walletModel.js");
const razorpay = require("../services/razorpay.js");

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

    return JSON.parse(JSON.stringify(userCartData));
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  //product page - add to cart option
  addToCart: async (req, res) => {
    try {
      let existingProduct = await cartCollection.findOne({
        userId: req.session.currentUser._id,
        productId: req.params.id,
      });
      if (existingProduct)
        await cartCollection.updateOne(
          { _id: existingProduct._id },
          { $inc: { productQuantity: req.body.productQuantity } }
        );
      else
        await cartCollection.insertMany([
          {
            userId: req.session.currentUser._id,
            productId: req.params.id,
            productQuantity: req.body.productQuantity,
          },
        ]);
      res.status(200).json({ success: true });
    } catch (error) {
      console.log(error);
    }
  },
  //cart page - show cart page
  cart: async (req, res) => {
    try {
      let cartData = await grandTotal(req);
      res.render("userViews/cart", {
        currentUser: req.session.currentUser,
        cartData,
        grandTotal: req.session.grandTotal,
      });
    } catch (error) {
      console.error(error);
    }
  },
  //cart page - delete cart page
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
  checkoutPage: async (req, res) => {
    try {
      let addressData = await addressCollection.find({
        userId: req.session.currentUser._id,
      });

      if (addressData.length > 0) {
        //creating an order in database with default address, before cod or razor pay is chosen
        req.session.currentOrder = await orderCollection.create({
          userId: req.session.currentUser._id,
          orderNumber: (await orderCollection.countDocuments()) + 1,
          orderDate: new Date(),
          addressChosen: JSON.parse(JSON.stringify(addressData[0])), //default address
          cartData: await grandTotal(req),
          grandTotalCost: req.session.grandTotal,
        });

        res.render("userViews/checkoutPage", {
          currentUser: req.session.currentUser,
          grandTotal: req.session.grandTotal,
          addressData,
        });
      } else {
        req.session.addressPageFrom = "cart";
        res.redirect("/account/addAddress");
      }
    } catch (error) {
      console.error(error);
    }
  },
  //razorpay- creating an orderId with razorpay
  razorpayCreateOrderId: async (req, res) => {

    if(req.query?.combinedWalletPayment){

      let walletData = await walletCollection.findOne({userId: req.session.currentUser._id})

      var options = {
        amount: req.session.grandTotal - walletData.walletBalance  + "00", // amount in the smallest currency unit
        currency: "INR",
      };


    }else{

      var options = {
        amount: req.session.grandTotal + "00", // amount in the smallest currency unit
        currency: "INR",
      };
    }


    razorpay.instance.orders.create(options, function (err, order) {
      res.json(order);
    });
  },

  orderPlaced: async (req, res) => {
    try {
      console.log(req.session.grandTotal);
      if (req.body.razorpay_payment_id) {
        //razorpay payment
        await orderCollection.updateOne(
          { _id: req.session.currentOrder._id },
          {
            $set: {
              paymentId: req.body.razorpay_payment_id,
              paymentType: "Razorpay",
            },
          }
        );
        res.redirect("/checkout/orderPlacedEnd");
      } else if (req.body.walletPayment) {
        const walletData = await walletCollection.findOne({
          userId : req.session.currentUser._id,
        });
        if (walletData.walletBalance >= req.session.grandTotal) {
          walletData.walletBalance -= req.session.grandTotal;

          //wallet tranaction data
          let walletTransaction = {
            transactionDate : new Date(),
            transactionAmount: -req.session.grandTotal,
            transactionType: "Debited for placed order",
          };
          walletData.walletTransaction.push(walletTransaction)
          await walletData.save();

          await orderCollection.updateOne(
            { _id: req.session.currentOrder._id },
            {
              $set: {
                paymentId: Math.floor(Math.random() * 9000000000) + 1000000000 ,
                paymentType: "Wallet",
              },
            })

          res.json({ success: true });
        } else {
          return res.json({ insufficientWalletBalance: true });
        }
      } else {
        //incase of COD
        await orderCollection.updateOne(
          { _id: req.session.currentOrder._id },
          {
            $set: {
              paymentId: "generatedAtDelivery",
              paymentType: "COD",
            },
          }
        );

        res.json({ success: true });
      }
    } catch (error) {
      console.error(error);
    }
  },
  orderPlacedEnd: async (req, res) => {
    let cartData = await cartCollection
      .find({ userId: req.session.currentUser._id })
      .populate("productId");

    //reducing from stock qty
    cartData.map(async (v) => {
      v.productId.productStock -= v.productQuantity;
      await v.productId.save();
      return v;
    });

    let orderData= await orderCollection.findOne({ _id: req.session.currentOrder._id})
    if(orderData.paymentType =='toBeChosen'){
      orderData.paymentType = 'COD'
      orderData.save()
    }

    res.render("userViews/orderPlacedPage", {
      currentUser: req.session.currentUser,
      orderCartData: cartData,
      orderData: req.session.currentOrder,
    });

    //delete the cart- since the order is placed
    await cartCollection.deleteMany({ userId: req.session.currentUser._id });
    console.log("deleting finished");
  },

  //apply coupon
  applyCoupon: async (req, res) => {
    try {
      let { couponCode } = req.body;

      //Retrive the coupon document from the database if it exists
      let couponData = await couponCollection.findOne({ couponCode });

      if (couponData) {
        /*if coupon exists:
        > check if it is applicable, i.e within minimum purchase limit & expiry date
        >proceed... */

        let { grandTotal } = req.session;
        let { minimumPurchase, expiryDate } = couponData;
        let minimumPurchaseCheck = minimumPurchase < grandTotal;
        let expiryDateCheck = new Date() < new Date(expiryDate);

        if (minimumPurchaseCheck && expiryDateCheck) {
          /* if coupon exists check if it is applicable :
          >calculate the discount amount
          >update the database's order document
          >update the grand total in the req.session for the payment page
          */
          let { discountPercentage, maximumDiscount } = couponData;
          let discountAmount =
            (grandTotal * discountPercentage) / 100 > maximumDiscount
              ? maximumDiscount
              : (grandTotal * discountPercentage) / 100;

          let { currentOrder } = req.session;
          await orderCollection.findByIdAndUpdate(
            { _id: currentOrder._id },
            {
              $set: { couponApplied: couponData._id },
              $inc: { grandTotalCost: -discountAmount },
            }
          );

          req.session.grandTotal -= discountAmount;

          // Respond with a success status and indication that the coupon was applied
          res.status(202).json({ couponApplied: true, discountAmount });
        } else {
          // Respond with an error status if the coupon is not applicable
          res.status(501).json({ couponApplied: false });
        }
      } else {
        // Respond with an error status if the coupon does not exist
        res.status(501).json({ couponApplied: false });
      }
    } catch (error) {
      console.error(error);
    }
  },
};
