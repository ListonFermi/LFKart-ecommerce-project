const express = require('express')
const app = express()
const dotenv= require('dotenv').config()
const path= require('node:path')
const userRoutes= require('./routes/userRoutes.js')
const session= require('express-session')

//connecting db
const dbConnect= require('./config/config.js')
dbConnect()

//setting view engine and giving the path of static pages
app.set('view engine','hbs')
app.use(express.static(path.join(__dirname,'public')))

//express-session
app.use(
    session({
      resave: true,
      saveUninitialized: true,
      secret: "my secret",
    })
  );

//parse incoming requests
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//linking the routes
app.use(userRoutes)

//listening to the port
const PORT=process.env.PORT || 1000
app.listen(PORT, ()=>console.log(`Server running in port: https://localhost:${PORT}`))