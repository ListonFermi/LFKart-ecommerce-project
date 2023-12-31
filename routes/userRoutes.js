const userRouter= require('express').Router()
const userController = require('../controller/userController.js')
const userAuth = require('../middlewares/userAuth.js')
const cartController= require('../controller/cartController.js')
const accountController = require('../controller/accountController.js')

//signup-login
userRouter.get('/', userController.landingPage )
userRouter.get('/signupLoginPage', userController.signupLoginPage )
userRouter.post('/otp', userController.userDetailsInModel, userController.sendOTP )
userRouter.post('/resendOTP', userController.sendOTP)
userRouter.post('/signup', userController.signup )
userRouter.post('/login', userController.login )
userRouter.post('/logout', userController.logout )

//forgot password
userRouter.get('/forgotPasswordPage', userController.forgotPasswordPage )
userRouter.post('/forgotOTP', userController.forgotUserDetailsInModel, userController.sendForgotOTP )
userRouter.post('/forgotPasswordPage3', userController.forgotPasswordPage3 )
userRouter.post('/forgotPasswordReset', userController.forgotPasswordReset )

//product details 
userRouter.get('/productDetails/:id', userController.productDetails )

//cart
userRouter.get('/cart', userAuth, cartController.cart )
userRouter.post('/addToCart/:id', userAuth, cartController.addToCart )
userRouter.get('/cart/delete/:id', cartController.deleteFromCart )

//account
userRouter.get('/account', userAuth, accountController.accountPage )
userRouter.get('/account/myAddress', userAuth, accountController.myAddress )
userRouter.get('/account/addAddress', userAuth, accountController.addAddress )
userRouter.post('/account/addAddress', userAuth, accountController.addAddressPost )
userRouter.get('/account/editAddress/:id', userAuth, accountController.editAddress )
userRouter.post('/account/editAddress/:id', userAuth, accountController.editAddressPost )
userRouter.get('/account/deleteAddress/:id', userAuth, accountController.deleteAddress )
userRouter.get('/account/personalInfo', userAuth, accountController.personalInfo )


//order routes
// /checkout
userRouter.get('/checkout', userAuth, cartController.checkoutPage1 )
userRouter.get('/checkout2', userAuth, cartController.checkoutPage2 )
userRouter.get('/orderPlaced', userAuth, cartController.orderPlaced )

module.exports= userRouter