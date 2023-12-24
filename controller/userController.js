const userCollection = require("../models/userModels.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../services/sendOTP.js");
const categoryCollection = require("../models/categoryModel.js");
const productCollection = require("../models/productModels.js");

module.exports = {
  //signup-login
  landingPage: async (req, res) => {
    try {
      const categoryData = await categoryCollection.find({ isListed: true });
      const productData = await productCollection.find({ isListed: true });
      res.render("userViews/landingPage", {
        currentUser: req.session.currentUser || req.session.exisitingUser,
        categoryData,
        productData
      });
    } catch (error) {
      console.error(error);
    }
  },
  signupLoginPage: async (req, res) => {
    try {
      if (!req.cookies.userToken) {
        res.render("userViews/signupLoginPage", {
          invalidCredentials: req.session.invalidCredentials,
          passwordResetSucess: req.session.passwordResetSucess
        });
        req.session.passwordResetSucess= null
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
      let email = req.body.email;
      let phonenumber = req.body.phonenumber;
      let exisitingUser = await userCollection.findOne({
        $or: [{ email }, { phonenumber }],
      });
      if (!exisitingUser) {
        let encryptedPassword = bcrypt.hashSync(req.body.password, 10);
        req.session.tempUserData = {
          username: req.body.username,
          email: req.body.email,
          phonenumber: req.body.phonenumber,
          password: encryptedPassword,
        };
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
      req.session.emailOfNewUser = req.body.email || req.session.emailOfNewUser
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
      req.session.currentUser = req.session.tempUserData;
      res.redirect("/");
    } catch (error) {
      console.error(error);
    }
  },
  login: async (req, res) => {
    try {
      let exisitingUser = await userCollection.findOne({email: req.body.email});
      if (exisitingUser) {
        let passwordMatch = bcrypt.compareSync(
          req.body.password,
          exisitingUser.password
        );
        console.log(passwordMatch);
        if (passwordMatch) {
          req.session.exisitingUser = exisitingUser;
          const userToken = jwt.sign(req.body, process.env.MY_SECRET_KEY, {
            expiresIn: "1h",
          });
          res.cookie("userToken", userToken, { httpOnly: true });
          res.redirect("/");
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
  forgotPasswordPage: async (req,res)=>{
    res.render('userViews/forgotPasswordPage', { forgotUserEmailDoesntExist: req.session.forgotUserEmailDoesntExist })
    req.session.forgotUserEmailDoesntExist =null
  },
  forgotUserDetailsInModel: async (req,res,next)=>{
    try {
      console.log(req.body);
      const forgotUserData= await userCollection.findOne({email : req.body.email})
      if(!forgotUserData){
        req.session.forgotUserEmailDoesntExist = true
        return res.redirect('/forgotPasswordPage')
      }
      req.session.forgotUserData= forgotUserData
      next()
    } catch (error) {
      console.error(error)
    }
  },
  sendForgotOTP: async (req,res)=>{
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
      res.render("userViews/forgotPasswordPage2", { currentOTP: req.session.otp });
    } catch (error) {
      console.error(error);
    }
  },
  forgotPasswordPage3: async (req,res)=>{
    res.render('userViews/forgotPasswordPage3')
  },
  forgotPasswordReset: async (req,res)=>{
    try {
      let encryptedPassword = bcrypt.hashSync(req.body.newPassword, 10);
      await userCollection.findOneAndUpdate({ _id: req.session.forgotUserData._id}, { $set:{  password: encryptedPassword  } });
      req.session.passwordResetSucess= true
      res.redirect("/signupLoginPage");
    } catch (error) {
      console.error(error);
    }
  },

  //product details
  productDetails: async (req,res) =>{
    try {
      const currentProduct= await productCollection.findOne({ _id: req.params.id });
      res.render('userViews/productDetails',{currentProduct})
    } catch (error) {
      console.error(error)
    }
  }
};
