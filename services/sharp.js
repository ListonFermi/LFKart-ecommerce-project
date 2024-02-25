const sharp = require("sharp");

module.exports = {
  cropImage: async (imagePath) => {
    try {
      await sharp(imagePath)
        .extract({ left: 0, width: 500, height: 500, top: 0 })
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        .toFile("public/images/uploads/processed_images/productImage"+uniqueSuffix+".jpg");
      console.log("sharpening done");
    } catch (error) {
      console.error(error);
    }
  },
};
