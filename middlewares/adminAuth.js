module.exports = async (req, res, next) => {
  try {
    if (req.cookies.token) {
      next();
    } else {
      res.redirect('/admin');
    }
  } catch (error) {
    console.error(error);
  }
};
