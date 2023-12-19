const userRouter= require('express').Router()
const userController = require('../controller/userController.js')
const userAuth = require('../middlewares/userAuth.js')

//signup-login
userRouter.get('/', userController.landingPage )
userRouter.get('/signupLoginPage', userController.signupLoginPage )
userRouter.post('/signup', userController.signup )
userRouter.post('/login', userController.login )
userRouter.post('/logout', userAuth, userController.logout )

//otp
userRouter.post('/otp', userController.sendOTP )

module.exports= userRouter