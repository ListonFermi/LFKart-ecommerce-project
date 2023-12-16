const userCollection= require('../models/userModels.js')

module.exports={
    landingPage : (req,res)=>{
        
        res.render('userViews/landingPage')
    },
    signup: async (req,res)=>{
        console.log(req.body);
        let userExists= await userCollection.findOne( {email: req.body.email} )
        req.session.userExists = userExists
        res.redirect('/')
    }
}