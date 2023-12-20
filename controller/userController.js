const userCollection = require("../models/userModels.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../services/sendOTP.js");

module.exports = {
  landingPage: (req, res) => {
    res.render("userViews/landingPage", { currentUser: req.cookies.userToken });
  },
  signupLoginPage: (req, res) => {
    res.render("userViews/signupLoginPage");
  },
  userDetailsInModel: async (req, res, next) => {
    let email = req.body.email;
    let phonenumber = req.body.phonenumber;
    let exisitingUser = await userCollection.findOne({
      $or: [{ email }, { phonenumber }],
    });
    if (!exisitingUser) {
      let encryptedPassword = bcrypt.hashSync(req.body.password, 10);
      let newUser = new userCollection({
        username: req.body.username,
        email: req.body.email,
        phonenumber: req.body.phonenumber,
        password: encryptedPassword,
      });
      req.session.tempUserData = newUser;
      next();
    } else {
      res.render("userViews/signupLoginPage", { emailPhoneExists: true });
    }
  },
  sendOTP: async (req, res) => {
    const otp = Math.trunc(Math.random() * 10000);
    req.session.otp = otp;
    req.session.otpTime = new Date();
    await transporter.sendMail({
      from: `${process.env.GMAIL_ID}`,
      to: `${req.body.email}`,
      subject: "Registration OTP for LF-Kart",
      text: `Your OTP is ${otp}`,
    });
    res.render("userViews/otpPage", { currentOTP: req.session.otp });
  },
  signup: async (req, res) => {
    req.session.tempUserData.save()
    const userToken = jwt.sign(req.body, process.env.MY_SECRET_KEY, { expiresIn: "1h"})
    res.cookie("userToken", userToken, { httpOnly: true })
    req.session.currentUser = 
    res.redirect('/')
  },
  login: async (req, res) => {
    let exisitingUser = await userCollection.findOne({ email: req.body.email });
    if (exisitingUser) {
      let passwordMatch = bcrypt.compareSync(
        req.body.password,
        exisitingUser.password
      );
      if (passwordMatch) {
        req.session.exisitingUser = exisitingUser;
        const token = jwt.sign(req.body, process.env.MY_SECRET_KEY, {
          expiresIn: "1h",
        });
        res.cookie("token", token, { httpOnly: true });
        res.redirect("/");
      } else {
        res.redirect("/");
      }
    } else {
      req.session.invalidCredentials = true;
      res.redirect("/");
    }
  },
  logout: async (req, res) => {
    res.clearCookie("userToken");
    req.session.exisitingUser = null;
    req.session.newUser = null;
    res.redirect("/");
  }
};
