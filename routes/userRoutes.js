const userRouter = require('express').Router()
const userController = require('../controller/userController.js')
const userAuth = require('../middlewares/userAuth.js')
const cartController = require('../controller/cartController.js')
const accountController = require('../controller/accountController.js')
const blockedUserCheck = require('../middlewares/blockedUserCheck.js')

//signup-login
userRouter.get('/', blockedUserCheck, userController.landingPage)
userRouter.get('/signupLoginPage', userController.signupLoginPage)
userRouter.post('/otp', userController.userDetailsInModel, userController.sendOTP)
userRouter.post('/resendOTP', userController.sendOTP)
userRouter.post('/signup', userController.signup)
userRouter.post('/login', userController.login)
userRouter.post('/logout', userController.logout)

//forgot password
userRouter.get('/forgotPasswordPage', userController.forgotPasswordPage)
userRouter.post('/forgotOTP', userController.forgotUserDetailsInModel, userController.sendForgotOTP)
userRouter.post('/forgotPasswordPage3', userController.forgotPasswordPage3)
userRouter.post('/forgotPasswordReset', userController.forgotPasswordReset)

//product details 
userRouter.get('/productDetails/:id', blockedUserCheck, userController.productDetails)

//cart
userRouter.get('/cart', blockedUserCheck, userAuth, cartController.cart) //cart-page
userRouter.post('/addToCart/:id', blockedUserCheck, userAuth, cartController.addToCart) //add to cart from product page
//cart-page
userRouter.get('/cart/delete/:id', blockedUserCheck, cartController.deleteFromCart) //delete from cart from cart page
userRouter.put('/cart/decQty/:id', blockedUserCheck, userAuth, cartController.decQty)
userRouter.put('/cart/incQty/:id', blockedUserCheck, userAuth, cartController.incQty)

//account
userRouter.get('/account', blockedUserCheck, userAuth, accountController.accountPage)
//account-orderList
userRouter.get('/account/orderList', blockedUserCheck, userAuth, accountController.orderList)

userRouter.get('/account/myAddress', blockedUserCheck, userAuth, accountController.myAddress)
userRouter.get('/account/addAddress', blockedUserCheck, userAuth, accountController.addAddress)
userRouter.post('/account/addAddress', blockedUserCheck, userAuth, accountController.addAddressPost)
userRouter.get('/account/editAddress/:id', blockedUserCheck, userAuth, accountController.editAddress)
userRouter.post('/account/editAddress/:id', blockedUserCheck, userAuth, accountController.editAddressPost)
userRouter.get('/account/deleteAddress/:id', blockedUserCheck, userAuth, accountController.deleteAddress)
userRouter.get('/account/personalInfo', blockedUserCheck, userAuth, accountController.personalInfo)

//order routes-checkout
userRouter.get('/checkout', blockedUserCheck, userAuth, cartController.checkoutPage1)
userRouter.get('/checkout2', blockedUserCheck, userAuth, cartController.checkoutPage2)
userRouter.get('/orderPlaced', blockedUserCheck, userAuth, cartController.orderPlaced)

userRouter.get('/shop', blockedUserCheck, userController.shopPage)

module.exports = userRouter