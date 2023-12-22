const adminRouter= require('express').Router()
const adminController= require('../controller/adminController.js')
const categoryController = require('../controller/categoryController.js')
const productController = require('../controller/productController.js')
const adminAuth = require('../middlewares/adminAuth.js')
const upload= require('../services/multer.js')

//login and logout 
adminRouter.get('/', adminController.loginPage )
adminRouter.post('/', adminController.login)
adminRouter.get('/dashboard', adminAuth, adminController.dashboard)
adminRouter.post('/logout', adminController.logout )

//user management
adminRouter.get('/userManagement', adminAuth, adminController.userManagement)
adminRouter.post('/userManagement/block/:id', adminAuth, adminController.blockUser )
adminRouter.post('/userManagement/unBlock/:id', adminAuth, adminController.unBlockUser)

//category management
adminRouter.get('/categoryManagement', adminAuth, categoryController.categoryManagement)
adminRouter.post('/categoryManagement/add', adminAuth, categoryController.addCategory)
adminRouter.post('/categoryManagement/edit/:id', adminAuth, categoryController.editCategory)
adminRouter.post('/categoryManagement/unList/:id', adminAuth, categoryController.unlistCategory)
adminRouter.post('/categoryManagement/list/:id', adminAuth, categoryController.listCategory)
adminRouter.get('/categoryManagement/delete/:id', adminAuth, categoryController.deleteCategory)

//product management
adminRouter.get('/productManagement', adminAuth, productController.productManagement)
adminRouter.post('/productManagement/add', adminAuth, upload.any(), productController.addProduct)
adminRouter.post('/productManagement/edit/:id', adminAuth, upload.any(), productController.editProduct)
adminRouter.post('/productManagement/unList/:id', adminAuth, productController.unListProduct)
adminRouter.post('/productManagement/list/:id', adminAuth, productController.listProduct)
adminRouter.get('/productManagement/delete/:id', adminAuth, productController.deleteProduct)

module.exports= adminRouter