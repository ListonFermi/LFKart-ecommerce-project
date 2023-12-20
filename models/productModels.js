const mongoose= require('mongoose')

const productSchema= new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    productImage1:{
        type: String,
        required: true
    },
    productImage2:{
        type: String,
        required: true
    },
    productImage3:{
        type: String,
        required: true
    },
    productPrice:{
        type: Number,
        required: true
    },
    inStock: {
        type: Boolean,
        default: true
    }
})

const productCollection= mongoose.model('products',productSchema)

module.exports= productCollection