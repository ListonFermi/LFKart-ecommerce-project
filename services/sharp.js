const sharp = require("sharp");

module.exports = {
  cropImage: async (imagePath) => {
    try {
      await sharp(imagePath)
        .extract({ left: 0, width: 1500, height: 1500, top: 0 })
        .toFile("public/images/productImages/processed_images/hhh.jpg");
      console.log("sharpening done");
    } catch (error) {
      console.error(error);
    }
  },
};
