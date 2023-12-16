const mongoose= require('mongoose')

const userSchema= new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    isBlocked: { type: Boolean, default: false}

})

const userCollection= mongoose.model('users', userSchema)

module.exports= userCollection
