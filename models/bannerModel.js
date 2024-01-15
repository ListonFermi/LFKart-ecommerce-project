const mongoose= require('mongoose')

const bannerSchema= new mongoose.Schema({
    images:  { type: String, required: true   }    
}, { timestamps: true })

const bannerCollection= mongoose.model('bannerImages', bannerSchema)

module.exports= bannerCollection