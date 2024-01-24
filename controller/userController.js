const userCollection = require("../models/userModels.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../services/sendOTP.js");
const categoryCollection = require("../models/categoryModel.js");
const productCollection = require("../models/productModels.js");
const cartCollection = require("../models/cartModel.js");
const bannerCollection = require("../models/bannerModel.js");
const applyProductOffers = require("../helpers/applyProductOffers.js").applyProductOffer;
const applyReferralOffer= require('../helpers/applyReferralOffer.js')

module.exports = {
  //signup-login
  landingPage: async (req, res) => {
    try {
      const categoryData = await categoryCollection.find({ isListed: true });
      const productData = await productCollection.find({ isListed: true });
      const bannerData= await bannerCollection.find()

      console.log(await applyProductOffers('landingPage'));
      
      
      res.render("userViews/landingPage", {
        currentUser: req.session.currentUser,
        categoryData,
        productData,
        bannerData
      });
    } catch (error) {
      console.error(error);
    }
  },
  signupLoginPage: async (req, res) => {
    try {
      if (!req.cookies.userToken) {
        res.render("userViews/signupLoginPage", {
          currentUser: req.session.currentUser,
          invalidCredentials: req.session.invalidCredentials,
          passwordResetSucess: req.session.passwordResetSucess,
        });
        req.session.passwordResetSucess = null;
        req.session.invalidCredentials = null;
      } else {
        res.redirect("/");
      }
    } catch (error) {
      console.error(error);
    }
  },
  userDetailsInModel: async (req, res, next) => {
    try {
      let {email , phonenumber}= req.body;
      let exisitingUser = await userCollection.findOne({
        $or: [{ email }, { phonenumber }],
      });
      let referralCode= Math.floor(1000 + Math.random() * 9000);
      if (!exisitingUser) {
        let encryptedPassword = bcrypt.hashSync(req.body.password, 10);
        req.session.tempUserData = {
          username: req.body.username,
          email: req.body.email,
          phonenumber: req.body.phonenumber,
          password: encryptedPassword,
          referralCode
        };
        req.session.tempUserReferralCode= req.body?.referralCode
        next();
      } else {
        res.render("userViews/signupLoginPage", { emailPhoneExists: true });
      }
    } catch (error) {
      console.error(error);
    }
  },
  sendOTP: async (req, res) => {
    try {
      req.session.emailOfNewUser = req.body.email || req.session.emailOfNewUser;
      const otp = Math.trunc(Math.random() * 10000);
      req.session.otp = otp;
      await transporter.sendMail({
        from: `${process.env.GMAIL_ID}`,
        to: `${req.session.emailOfNewUser}`,
        subject: "Registration OTP for LF-Kart",
        text: `Your OTP is ${otp}`,
      });
      res.render("userViews/otpPage", { currentOTP: req.session.otp });
    } catch (error) {
      console.error(error);
    }
  },
  signup: async (req, res) => {
    try {
      await userCollection.create(req.session.tempUserData);
      const userToken = jwt.sign(req.body, process.env.MY_SECRET_KEY, {
        expiresIn: "1h",
      });
      res.cookie("userToken", userToken, { httpOnly: true });
      req.session.currentUser = await userCollection.findOne({ email: req.session.tempUserData.email});

      //adding money to the reffered user's wallet if referral code exists
      let tempUserReferralCode=  req.session?.tempUserReferralCode
      await applyReferralOffer(tempUserReferralCode)

      res.redirect("/");
    } catch (error) {
      console.error(error);
    }
  },
  login: async (req, res) => {
    try {
      let exisitingUser = await userCollection.findOne({
        email: req.body.email,
        isBlocked: false
      });
      if (exisitingUser) {
        let passwordMatch = bcrypt.compareSync(
          req.body.password,
          exisitingUser.password
        );
        console.log(passwordMatch);
        if (passwordMatch) {
          req.session.currentUser = exisitingUser;
          const userToken = jwt.sign(req.body, process.env.MY_SECRET_KEY, {
            expiresIn: "1h",
          });
          res.cookie("userToken", userToken, { httpOnly: true });
          res.redirect("back");
        } else {
          req.session.invalidCredentials = true;
          res.redirect("/signupLoginPage");
        }
      } else {
        req.session.invalidCredentials = true;
        res.redirect("/signupLoginPage");
      }
    } catch (error) {
      console.error(error);
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("userToken");
      req.session.destroy();
      res.redirect("/");
    } catch (error) {
      console.error(error);
    }
  },

  //forgot password
  forgotPasswordPage: async (req, res) => {
    try {
      res.render("userViews/forgotPasswordPage", {
        forgotUserEmailDoesntExist: req.session.forgotUserEmailDoesntExist,
      });
      req.session.forgotUserEmailDoesntExist = null;
    } catch (error) {
      console.error(error);
    }
  },
  forgotUserDetailsInModel: async (req, res, next) => {
    try {
      console.log(req.body);
      const forgotUserData = await userCollection.findOne({
        email: req.body.email,
      });
      if (!forgotUserData) {
        req.session.forgotUserEmailDoesntExist = true;
        return res.redirect("/forgotPasswordPage");
      }
      req.session.forgotUserData = forgotUserData;
      next();
    } catch (error) {
      console.error(error);
    }
  },
  sendForgotOTP: async (req, res) => {
    try {
      const otp = Math.trunc(Math.random() * 10000);
      req.session.otp = otp;
      req.session.otpTime = new Date();
      await transporter.sendMail({
        from: `${process.env.GMAIL_ID}`,
        to: `${req.body.email}`,
        subject: "Change Password OTP for LF-Kart",
        text: `Your OTP is ${otp}`,
      });
      res.render("userViews/forgotPasswordPage2", {
        currentOTP: req.session.otp,
      });
    } catch (error) {
      console.error(error);
    }
  },
  forgotPasswordPage3: async (req, res) => {
    try {
      res.render("userViews/forgotPasswordPage3");
    } catch (error) {
      console.error(error)
    } 
  },
  forgotPasswordReset: async (req, res) => {
    try {
      let encryptedPassword = bcrypt.hashSync(req.body.newPassword, 10);
      await userCollection.findOneAndUpdate(
        { _id: req.session.forgotUserData._id },
        { $set: { password: encryptedPassword } }
      );
      req.session.passwordResetSucess = true;
      res.redirect("/signupLoginPage");
    } catch (error) {
      console.error(error);
    }
  },

  //product details
  productDetails: async (req, res) => {
    try {
      const currentProduct = await productCollection.findOne({
        _id: req.params.id,
      });
      var cartProductQuantity=0
      if(req.session?.currentUser?._id){
        const cartProduct = await cartCollection.findOne({ userId: req.session.currentUser._id, productId: req.params.id })
        if(cartProduct){
          var cartProductQuantity= cartProduct.productQuantity
        }
      }     
      let productQtyLimit= [],i=0
      while(i<(currentProduct.productStock - cartProductQuantity )){
        productQtyLimit.push(i+1)
        i++
      }
      res.render("userViews/productDetails", { currentUser: req.session.currentUser, currentProduct, productQtyLimit });
    } catch (error) {
      console.error(error);
    }
  },
};