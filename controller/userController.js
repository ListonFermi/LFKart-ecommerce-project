const userCollection = require("../models/userModels.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../services/sendOTP.js");

module.exports = {
  landingPage: (req, res) => {
    res.render("userViews/landingPage", {
      currentUser: req.session.exisitingUser || req.session.newUser,
      invalidCredentials: req.session.invalidCredentials,
    });
  },
  signupLoginPage: (req, res) => {
    res.render("userViews/signupLoginPage");
  },
  signup: async (req, res) => {
    let exisitingUser = await userCollection.findOne({ email: req.body.email });
    if (!exisitingUser) {
      let encryptedPassword = bcrypt.hashSync(req.body.password, 10);
      let newUser = new userCollection({
        username: req.body.username,
        email: req.body.email,
        phonenumber: req.body.phonenumber,
        password: encryptedPassword,
      }).save();
      const token = jwt.sign(req.body, process.env.MY_SECRET_KEY, {
        expiresIn: "1h",
      });
      res.cookie("token", token, { httpOnly: true });
      req.session.newUser = newUser;
      res.redirect("/");
    } else {
      req.session.exisitingUser = exisitingUser;
      res.redirect("/");
    }
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
    res.clearCookie("token");
    req.session.exisitingUser = null;
    req.session.newUser = null;
    res.redirect("/");
  },

  //otp
  sendOTP: async (req, res) => {
    const otp = Math.trunc(Math.random() * 10000);
    req.session.otp= otp
    await transporter.sendMail({
      from: `${process.env.GMAIL_ID}`,
      to: `${req.body.email}`,
      subject: "Registration OTP for LF-Kart",
      text: `Your OTP is ${otp}`,
    });
    res.render('userViews/otpPage')
  },
};
