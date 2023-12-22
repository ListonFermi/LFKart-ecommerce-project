const mongoose= require('mongoose')

const categorySchema= new mongoose.Schema({
    categoryName: {
        type: String,
        required: true
    },
    categoryDescription:{
        type: String,
        required: true
    },
    isListed: {
        type: Boolean,
        default: true
    }
})

const categoryCollection= mongoose.model('categories',categorySchema)

module.exports= categoryCollection