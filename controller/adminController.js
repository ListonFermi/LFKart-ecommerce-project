const adminCollection= require('../models/adminModels.js')
const bcrypt= require('bcrypt')
const jwt = require('jsonwebtoken');

module.exports={
    loginPage : async (req,res)=>{
        if(req.cookies.token){
            res.redirect('/admin/dashboard')
        }else{
            res.render('adminViews/adminLogin',{ invalidCredentials: req.session.invalidCredentials})
            req.session.invalidCredentials = false
        }
    },
    login: async (req,res)=>{
        let adminData= await adminCollection.findOne({ email: req.body.email})
        if(adminData.email == req.body.email && adminData.password == req.body.password){
            const token= jwt.sign(req.body , process.env.MY_SECRET_KEY )
            res.cookie('token', token, {httpOnly: true})
            res.redirect('/admin/dashboard')
        }else{
            req.session.invalidCredentials = true
            res.redirect('/admin')
        }
    },
    dashboard: async (req,res)=>{
        res.render('adminViews/adminDashboard')
    },
    logout: async(req,res)=>{
        res.clearCookie('token')
        res.redirect('/admin')
    }
}