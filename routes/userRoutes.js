const userRouter = require('express').Router()
const userController = require('../controller/userController.js')
const userAuth = require('../middlewares/userAuth.js')
const cartController = require('../controller/cartController.js')
const accountController = require('../controller/accountController.js')
const blockedUserCheck = require('../middlewares/blockedUserCheck.js')
const upload= require('../services/multer.js')
const shopPageController = require('../controller/shopPageController.js')

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

//product details page
userRouter.get('/productDetails/:id', blockedUserCheck, userController.productDetails)

//product page - add to cart option
userRouter.post('/addToCart/:id', blockedUserCheck, userAuth, cartController.addToCart) //add to cart from product page
//cart-page
userRouter.get('/cart', blockedUserCheck, userAuth, cartController.cart) //cart page - show cart page
userRouter.delete('/cart/delete/:id', blockedUserCheck, cartController.deleteFromCart) //delete from cart page
userRouter.put('/cart/decQty/:id', blockedUserCheck, userAuth, cartController.decQty)
userRouter.put('/cart/incQty/:id', blockedUserCheck, userAuth, cartController.incQty)

//account page
userRouter.get('/account', blockedUserCheck, userAuth, accountController.accountPage)
//account-orderList
userRouter.get('/account/orderList', blockedUserCheck, userAuth, accountController.orderList)
userRouter.get('/account/orderList/orderStatus/:id', blockedUserCheck, userAuth, accountController.orderStatus)
userRouter.put('/account/orderList/orderStatus/cancelOrder/:id', blockedUserCheck, userAuth, accountController.cancelOrder )
userRouter.get('/account/orderList/orderStatus/downloadInvoice/:id', blockedUserCheck, userAuth, accountController.downloadInvoice)
//account-my address
userRouter.get('/account/myAddress', blockedUserCheck, userAuth, accountController.myAddress)
//account-edit address
userRouter.get('/account/addAddress', blockedUserCheck, userAuth, accountController.addAddress)
userRouter.post('/account/addAddress', blockedUserCheck, userAuth, accountController.addAddressPost)
userRouter.get('/account/editAddress/:id', blockedUserCheck, userAuth, accountController.editAddress)
userRouter.post('/account/editAddress/:id', blockedUserCheck, userAuth, accountController.editAddressPost)
userRouter.get('/account/deleteAddress/:id', blockedUserCheck, userAuth, accountController.deleteAddress)
//account-change password
userRouter.get('/account/changePassword', blockedUserCheck, userAuth, accountController.changePassword)
userRouter.patch('/account/changePassword', blockedUserCheck, userAuth, accountController.changePasswordPatch)

//order routes-checkout
userRouter.get('/checkout', blockedUserCheck, userAuth, cartController.checkoutPage)
userRouter.all('/checkout/orderPlaced', blockedUserCheck, userAuth, cartController.orderPlaced)
userRouter.all('/checkout/orderPlacedEnd', blockedUserCheck, userAuth, cartController.orderPlacedEnd)
userRouter.post('/checkout/razorpay/create/orderId', blockedUserCheck, userAuth, cartController.razorpayCreateOrderId)
userRouter.post('/checkout/applyCoupon', blockedUserCheck, userAuth, cartController.applyCoupon)

//shop page
userRouter.get('/shop', blockedUserCheck, shopPageController.shopPage)
userRouter.get('/shop/filter/category/:categoryName', blockedUserCheck, shopPageController.filterCategory)
userRouter.get('/shop/filter/priceRange', blockedUserCheck, shopPageController.filterPriceRange)
userRouter.get('/shop/sort/priceAscending', blockedUserCheck, shopPageController.sortPriceAscending)
userRouter.get('/shop/sort/priceDescending', blockedUserCheck, shopPageController.sortPriceDescending)

module.exports = userRouter