const cartCollection = require("../models/cartModel.js");
const productCollection = require("../models/productModels.js");
const userCollection = require("../models/userModels.js");

module.exports = {
  cart: async (req, res) => {
    try {
      if (req.cookies.userToken) {
        const userCartData = await cartCollection.findOne({
          userId: req.session.currentUser._id,
        });
        res.render("userViews/cart", {
          userCartData,
        });
      } else {
        res.redirect("/signupLoginPage");
      }
    } catch (error) {
      console.error(error);
    }
  },
  addToCart: async (req, res) => {
    console.log(req.session.currentUser);
    console.log(req.body);
    try {
      if (req.cookies.userToken) {
        const productData = await productCollection.findOne({
          _id: req.params.id,
        });
        await cartCollection.updateOne(
          { userId: req.session.currentUser._id },
          {
            $push: {
              cartProducts: {
                productId: productData._id,
                productName: productData.productName,
                productImage: productData.productImage1,
                productPrice: productData.productPrice,
                productQuantity: req.body.productQuantity,
              },
            },
          },
          { upsert: true }
        );
        res.redirect("back");
      } else {
        res.redirect("/signupLoginPage");
      }
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
};
