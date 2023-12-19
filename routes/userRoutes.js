const userRouter= require('express').Router()
const userController = require('../controller/userController.js')
const userAuth = require('../middlewares/userAuth.js')

//signup-login
userRouter.get('/', userController.landingPage )
userRouter.post('/signup', userController.signup )
userRouter.post('/login', userController.login )
userRouter.get('/logout', userAuth, userController.logout )

//otp


module.exports= userRouter