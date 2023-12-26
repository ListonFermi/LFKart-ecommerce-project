module.exports= async (req,res,next) =>{
  try {
    if(!req.cookies.userToken){
      next()
    }else{
      res.redirect('/')
    }
  } catch (error) {
    console.error(error)
  }
}