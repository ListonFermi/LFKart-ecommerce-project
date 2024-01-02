const mongoose= require('mongoose')

const productSchema= new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    parentCategory:{
        type: String,
        required: true
    },
    productImage1:{
        type: String,
    },
    productImage2:{
        type: String,
    },
    productImage3:{
        type: String,
    },
    productPrice:{
        type: Number,
        required: true
    },
    productStock: {
        type: Number,
        required: true
    },
    isListed: {
        type: Boolean,
        default: true
    }
})

const productCollection= mongoose.model('products',productSchema)

module.exports= productCollection