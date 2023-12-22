const userRouter= require('express').Router()
const userController = require('../controller/userController.js')
const userAuth = require('../middlewares/userAuth.js')

//signup-login
userRouter.get('/', userController.landingPage )
userRouter.get('/signupLoginPage', userController.signupLoginPage )
userRouter.post('/otp', userController.userDetailsInModel, userController.sendOTP )
userRouter.post('/signup', userController.signup )
userRouter.post('/login', userController.login )
userRouter.post('/logout', userController.logout )

//forgot password
userRouter.get('/forgotPasswordPage', userController.forgotPasswordPage )
userRouter.post('/forgotOTP', userController.forgotUserDetailsInModel, userController.sendForgotOTP )
userRouter.post('/forgotPasswordPage3', userController.forgotPasswordPage3 )
userRouter.post('/forgotPasswordReset', userController.forgotPasswordReset )

//product details 
userRouter.get('/productDetails/:id', userAuth,  userController.productDetails )

module.exports= userRouter