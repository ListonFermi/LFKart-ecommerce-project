const couponCollection = require("../models/couponModel")
const orderCollection = require("../models/orderModel")

module.exports={
    couponManagement: async (req,res)=>{
        try {
            
        } catch (error) {
            console.error(error)
        }
        res.render('adminViews/couponManagement')
    },
    addCoupon: async (req,res)=>{
        try {
            console.log('test');
            console.log(req.body);
            await couponCollection.insertMany([{
                couponCode: req.body.couponCode,
                discountPercentage: req.body.discountPercentage,
                // startDate: new Date(req.body.startDate),
                // expiryDate: new Date(req.body.expiryDate),
                minimumPurchase: req.body.minimumPurchase,
                minimumDiscount: req.body.maximumDiscount
            }])
            res.json({ couponAdded: true})
        } catch (error) {
            console.error(error)
        }
    }
}