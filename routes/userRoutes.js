const userRouter= require('express').Router()
const userController = require('../controller/userController.js')
const userAuth = require('../middlewares/userAuth.js')
const cartController= require('../controller/cartController.js')

//signup-login
userRouter.get('/', userController.landingPage )
userRouter.get('/signupLoginPage', userAuth, userController.signupLoginPage )
userRouter.post('/otp', userController.userDetailsInModel, userController.sendOTP )
userRouter.post('/resendOTP', userController.sendOTP)
userRouter.post('/signup', userController.signup )
userRouter.post('/login', userController.login )
userRouter.post('/logout', userController.logout )

//forgot password
userRouter.get('/forgotPasswordPage', userAuth, userController.forgotPasswordPage )
userRouter.post('/forgotOTP', userController.forgotUserDetailsInModel, userController.sendForgotOTP )
userRouter.post('/forgotPasswordPage3', userController.forgotPasswordPage3 )
userRouter.post('/forgotPasswordReset', userController.forgotPasswordReset )

//product details 
userRouter.get('/productDetails/:id', userController.productDetails )

//cart
userRouter.get('/cart', cartController.cart )
userRouter.post('/addToCart/:id', cartController.addToCart )

module.exports= userRouter