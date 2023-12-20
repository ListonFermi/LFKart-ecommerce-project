const adminCollection= require('../models/adminModels.js')
const jwt = require('jsonwebtoken');
const userCollection = require('../models/userModels.js');
const categoryCollection= require('../models/categoryModel.js');
const productCollection = require('../models/productModels.js');


module.exports={
    //login and logout
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
    },

    //user management
    userManagement: async (req,res)=>{
        let allUsersData= await userCollection.find({},{password: false})
        res.render('adminViews/userManagement', {allUsersData})
    },
    blockUser: async(req,res)=>{
        await userCollection.findOneAndUpdate({_id: req.params.id},{$set:{ isBlocked: true }})
        res.redirect('/admin/userManagement')
    },
    unBlockUser: async (req,res)=>{
        await userCollection.findOneAndUpdate({_id: req.params.id},{$set:{ isBlocked: false }})
        res.redirect('/admin/userManagement')
    },

    //category management
    categoryManagement: async (req,res)=>{
        let categoryData= await categoryCollection.find()
        res.render('adminViews/categoryManagement', {categoryData}) 
    },
    addCategory: async (req,res)=>{
        await categoryCollection.insertMany([{categoryName: req.body.categoryName, categoryDescription: req.body.description, categoryImage :req.file.path }])
        res.redirect('/admin/categoryManagement')
    },
    editCategory: async (req,res)=>{
        const categoryData= await categoryCollection.findOne({_id: req.params.id })
    },
    deleteCategory: async (req,res)=>{
        await categoryCollection.findOneAndDelete({_id: req.params.id})
        res.redirect('/admin/categoryManagement')
    },

    //product management
    productManagement: async (req,res)=>{
        let productData= await productCollection.find()
        let categoryList = await categoryCollection.find({},{categoryName: true})
        res.render('adminViews/productManagement', {productData, categoryList})
    },
}