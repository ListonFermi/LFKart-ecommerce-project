const mongoose= require('mongoose')

const userSchema= new mongoose.Schema({
    username: { type: String, required: true},
    email: { type: String, required: true},
    phonenumber: { type: Number, required: true},
    password: { type: String, required: true},
    isBlocked: { type: Boolean, default: false},
})

const userCollection=mongoose.model('users', userSchema)

module.exports= userCollection