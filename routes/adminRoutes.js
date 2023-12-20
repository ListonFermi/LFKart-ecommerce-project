const adminRouter= require('express').Router()
const adminController= require('../controller/adminController.js')
const adminAuth = require('../middlewares/adminAuth.js')
const upload= require('../middlewares/multer.js')

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
adminRouter.get('/categoryManagement', adminAuth, adminController.categoryManagement)
adminRouter.post('/categoryManagement/add', adminAuth, upload.single('categoryImage'), adminController.addCategory)
adminRouter.get('/categoryManagement/edit/:id', adminAuth, adminController.editCategory)
adminRouter.get('/categoryManagement/delete/:id', adminAuth, adminController.deleteCategory)

//product management
adminRouter.get('/productManagement', adminAuth, adminController.productManagement)


module.exports= adminRouter