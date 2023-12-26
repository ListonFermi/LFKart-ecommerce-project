const mongoose= require('mongoose')

const cartSchema= new mongoose.Schema({
    productId: { type: mongoose.Types.ObjectId, required: true},
    quantity: {type: Number, default:1 , required: true}
})

const userSchema= new mongoose.Schema({
    username: { type: String, required: true},
    email: { type: String, required: true},
    phonenumber: { type: Number, required: true},
    password: { type: String, required: true},
    isBlocked: { type: Boolean, default: false},
    cart: [cartSchema]
})

const userCollection=mongoose.model('users', userSchema)

module.exports= userCollection
