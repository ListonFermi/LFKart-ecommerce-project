const userCollection = require("../models/userModels")

module.exports= async (req,res)=>{
    const userData= userCollection.findOne({email: ( req.session?.existingUser?.email || req.session?.newUser?.email ) })
    // if(userData.isBlocked){
    //     redirect('')
    // }        
}