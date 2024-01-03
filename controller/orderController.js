const orderCollection = require("../models/orderModel")

module.exports={
    //admin side- orderManagement
    orderManagement: async(req,res)=>{
        try {
            let orderData= await orderCollection.find().populate('userId')
            res.render('adminViews/orderManagement', { orderData })
        } catch (error) {
            console.error(error)
        }
    },
    changeStatusPending: async(req,res)=>{
        try {
            await orderCollection.findOneAndUpdate(
                { _id: req.params.id },
                { $set: { orderStatus: 'Pending' } }
            )
            res.redirect('/admin/orderManagement')
        } catch (error) {
            console.error(error)
        }
    },
    changeStatusShipped: async(req,res)=>{
        try {
            await orderCollection.findOneAndUpdate(
                { _id: req.params.id },
                { $set: { orderStatus: 'Shipped' } }
            )
            res.redirect('/admin/orderManagement')
        } catch (error) {
            console.error(error)
        }
    },
    changeStatusDelivered: async(req,res)=>{
        try {
            await orderCollection.findOneAndUpdate(
                { _id: req.params.id },
                { $set: { orderStatus: 'Delivered' } }
            )
            res.redirect('/admin/orderManagement')
        } catch (error) {
            console.error(error)
        }
    },
    changeStatusReturn: async(req,res)=>{
        try {
            await orderCollection.findOneAndUpdate(
                { _id: req.params.id },
                { $set: { orderStatus: 'Return' } }
            )
            res.redirect('/admin/orderManagement')
        } catch (error) {
            console.error(error)
        }
    },
    changeStatusCancelled: async(req,res)=>{
        try {
            await orderCollection.findOneAndUpdate(
                { _id: req.params.id },
                { $set: { orderStatus: 'Cancelled' } }
            )
            res.redirect('/admin/orderManagement')
        } catch (error) {
            console.error(error)
        }
    },
}