const couponCollection = require("../models/couponModel")
const formatDate= require('../helpers/formatDateHelper.js')

module.exports={
    couponManagement: async (req,res)=>{
        try {
            let couponData = await couponCollection.find()
            couponData= couponData.map( v=>{
                v.startDateFormatted = formatDate(v.startDate)
                v.expiryDateFormatted = formatDate(v.expiryDate)
                return v
            }  )
            res.render('adminViews/couponManagement', { couponData })
        } catch (error) {
            console.error(error)
        }
    },
    addCoupon: async (req,res)=>{
        try {
            let existingCoupon= await couponCollection.findOne({ couponCode : req.body.couponCode })
            if(!existingCoupon){
                await couponCollection.insertMany([{
                    couponCode: req.body.couponCode,
                    discountPercentage: req.body.discountPercentage,
                    startDate: new Date(req.body.startDate),
                    expiryDate: new Date(req.body.expiryDate),
                    minimumPurchase: req.body.minimumPurchase,
                    maximumDiscount: req.body.maximumDiscount
                }])
                res.json({ couponAdded: true})
            }else{
                res.json({couponCodeExists: true})
            }           
        } catch (error) {
            console.error(error)
        }
    },
    editCoupon: async (req,res)=>{
        try {
            // let existingCoupon= await couponCollection.findOne({ couponCode : { $regex: new RegExp(req.body.couponCode, "i") } })
            console.log(req.body);
            // if(!existingCoupon || (existingCoupon._id==req.params.id) ){
            //     await couponCollection.insertMany([{
            //         couponCode: req.body.couponCode,
            //         discountPercentage: req.body.discountPercentage,
            //         startDate: new Date(req.body.startDate),
            //         expiryDate: new Date(req.body.expiryDate),
            //         minimumPurchase: req.body.minimumPurchase,
            //         maximumDiscount: req.body.maximumDiscount
            //     }])
                res.json({ couponEdited : true})
            // }else{
            //     res.json({couponCodeExists: true})
            // }           
        } catch (error) {
            console.error(error)
        }
    }
}