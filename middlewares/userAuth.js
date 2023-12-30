module.exports = async (req, res, next) => {
  try {
    if (req.cookies.userToken) {
      next();
    } else {
      res.redirect("/signupLoginPage");
    }
  } catch (error) {
    console.error(error);
  }
};
