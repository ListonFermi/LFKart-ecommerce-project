const userCollection = require("../models/userModels");

module.exports= async (req,res,next) =>{
  const currentUser= req.session.currentUser
  const isBlocked = userCollection.findOne({username: currentUser.username},{isBlocked: 1})
    try {
      if(req.cookies.userToken && !(isBlocked.isBlocked) ){
        next()
      }else{
        res.clearCookie('userToken')
        res.redirect('/')
      }
    } catch (error) {
        console.error(error);
    }
}