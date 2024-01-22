const mongoose= require('mongoose')

const bannerSchema= new mongoose.Schema({
    image:  { type: String, required: true   }    
}, { timestamps: true })

const bannerCollection= mongoose.model('banners', bannerSchema)

module.exports= bannerCollection