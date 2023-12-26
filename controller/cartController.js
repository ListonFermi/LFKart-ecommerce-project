const productCollection = require("../models/productModels.js");
const userCollection = require("../models/userModels.js");

module.exports = {
  cart: async (req, res) => {
    if (req.cookies.userToken) {
      res.render("userViews/cart", {
        currentUser: req.session.currentUser,
      });
    } else {
      res.redirect("/signupLoginPage");
    }
  },
  addToCart: async (req, res) => {
    console.log(req.session.currentUser);
    try {
        if (req.cookies.userToken) {
            let userData = await userCollection.findOne({
              _id: req.session.currentUser._id,
            });
            if (userData.cart?.productId==req.params.id) {
              await userCollection.findOneAndUpdate(
                { _id: req.session.currentUser._id },
                {
                  $addToSet: {
                    cart: { productId: req.params.id, quantity: req.body.quantity },
                  },
                }
              );
              res.redirect("back");
            } else {
              await userCollection.findOneAndUpdate(
                { _id: req.session.currentUser._id },
                {
                  $set: {
                    cart: { productId: req.params.id, quantity: req.body.quantity },
                  },
                },
              );
              res.redirect("back");
            }
          } else {
            res.redirect("/signupLoginPage");
          } 
    } catch (error) {
        console.log(error);
    }
  },
};
