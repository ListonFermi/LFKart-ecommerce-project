const adminCollection = require("../models/adminModels.js");
const jwt = require("jsonwebtoken");
const userCollection = require("../models/userModels.js");

module.exports = {
  //login and logout
  loginPage: async (req, res) => {
    try {
      if (req.cookies.token) {
        res.redirect("/admin/dashboard");
      } else {
        res.render("adminViews/adminLogin", {
          invalidCredentials: req.session.invalidCredentials,
        });
        req.session.invalidCredentials = false;
      }
    } catch (error) {
      console.error(error);
    }
  },
  login: async (req, res) => {
    try {
      let adminData = await adminCollection.findOne({ email: req.body.email });
      if (
        adminData.email == req.body.email &&
        adminData.password == req.body.password
      ) {
        const token = jwt.sign(req.body, process.env.MY_SECRET_KEY);
        res.cookie("token", token, { httpOnly: true });
        res.redirect("/admin/dashboard");
      } else {
        req.session.invalidCredentials = true;
        res.redirect("/admin");
      }
    } catch (error) {
      console.error(error);
    }
  },
  dashboard: async (req, res) => {
    try {
      res.render("adminViews/adminDashboard");
    } catch (error) {
      console.error(error);
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("token");
      res.redirect("/admin");
    } catch (error) {
      console.error(error);
    }
  },

  //user management
  userManagement: async (req, res) => {
    try {
      let allUsersData = await userCollection.find({}, { password: false });
      res.render("adminViews/userManagement", { allUsersData });
    } catch (error) {
      console.error(error);
    }
  },
  blockUser: async (req, res) => {
    try {
      await userCollection.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { isBlocked: true } }
      );
      res.redirect("/admin/userManagement");
    } catch (error) {
      console.error(error);
    }
  },
  unBlockUser: async (req, res) => {
    try {
      await userCollection.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { isBlocked: false } }
      );
      res.redirect("/admin/userManagement");
    } catch (error) {
      console.error(error);
    }
  },
};
