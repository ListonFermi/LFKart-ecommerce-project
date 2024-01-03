const addressCollection = require("../models/addressModel");
const orderCollection = require("../models/orderModel");

module.exports = {
  //account
  accountPage: async (req, res) => {
    try {
      res.render("userViews/account", { currentUser: req.session.currentUser });
    } catch (error) {
      console.error(error);
    }
  },

  //account-orderList
  orderList: async (req, res) => {
    try {
      let cartData= await orderCollection.find({userId: req.session.currentUser._id})
      res.render('userViews/orderList', { cartData })
    } catch (error) {
      console.error(error)
    }
  },

  
  myAddress: async (req, res) => {
    try {
      const addressData = await addressCollection.find({
        userId: req.session.currentUser._id
      });
      res.render("userViews/myAddress", {
        currentUser: req.session.currentUser,
        addressData
      });
    } catch (error) {
      console.error(error);
    }
  },
  addAddress: async (req, res) => {
    try {
      res.render("userViews/addAddress", {
        currentUser: req.session.currentUser,
      });
    } catch (error) {
      console.error(error);
    }
  },
  addAddressPost: async (req, res) => {
    try {
      const address = {
        userId: req.session.currentUser._id,
        addressTitle: req.body.addressTitle,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        addressLine1: req.body.addressLine1,
        addressLine2: req.body.addressLine2,
        phone: req.body.phone,
      };
      await addressCollection.insertMany([address])
      res.redirect("..");
    } catch (error) {
      console.error(error);
    }
  },
  editAddress: async (req, res) => {
    try {
      const existingAddress = await addressCollection.findOne({userId: req.session.currentUser._id, _id:req.params.id});
      console.log(existingAddress);
      res.render("userViews/editAddress", {
        currentUser: req.session.currentUser,
        existingAddress,
      });
    } catch (error) {
      console.error(error);
    }
  },
  editAddressPost: async (req, res) => {
    try {
      const address = {
        addressTitle: req.body.addressTitle,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        addressLine1: req.body.addressLine1,
        addressLine2: req.body.addressLine2,
        phone: req.body.phone,
      };
      await addressCollection.updateOne({_id:req.params.id},address)

      res.redirect('back')
    } catch (error) {
      console.error(error);
    }
  },
  deleteAddress: async (req, res) => {
    try {
      await addressCollection.deleteOne({_id: req.params.id})
      res.redirect('/account/myAddress')
    } catch (error) {
      console.log(error);
    }
  },

  //personal info
  personalInfo: async (req,res) =>{
    try {
      res.render('userViews/personalInfo')
    } catch (error) {
      console.error(error)
    }
  }
};
