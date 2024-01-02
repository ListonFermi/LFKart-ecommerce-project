const userCollection = require("../models/userModels");

module.exports = async (req, res, next) => {
  try {
    let currentUser = await userCollection.findOne({
      _id: req.session?.currentUser?._id,
    });
    if ( currentUser?.isBlocked) {
      res.clearCookie("userToken");
      req.session.destroy();
      res.redirect(req.originalUrl)
    } else {
      next();
    }
  } catch (error) {
    console.error(error)
  }
};
