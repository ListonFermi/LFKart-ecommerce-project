module.exports= async (req,res,next) =>{
  try {
    if(req.cookies.userToken){
      next()
    }else{
      res.clearCookie("userToken");
      req.session.destroy();
      next()
    }
  } catch (error) {
    console.error(error)
  }
}