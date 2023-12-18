const userRouter= require('express').Router()
const userController = require('../controller/userController.js')

//signup-login
userRouter.get('/', userController.landingPage )
userRouter.post('/signup', userController.signup )
userRouter.post('/login', userController.login )

module.exports= userRouter