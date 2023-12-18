const adminRouter= require('express').Router()
const adminController= require('../controller/adminController.js')
const adminAuth = require('../middlewares/adminAuth.js')

//login and logout 
adminRouter.get('/', adminController.loginPage )
adminRouter.post('/', adminController.login)
adminRouter.get('/dashboard', adminAuth, adminController.dashboard)
adminRouter.post('/logout', adminController.logout )

module.exports= adminRouter