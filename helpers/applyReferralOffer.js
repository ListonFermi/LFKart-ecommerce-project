const userCollection = require("../models/userModels");

module.exports = async (referralCode) => {
  try {
    let referralCodeExists = await userCollection.findOne({ referralCode });

    if (referralCodeExists) {
      await userCollection.updateOne(
        { _id: referralCodeExists._id },
        { $inc: { wallet: 500 } }
      );
      console.log("Referral Applied");
    }
  } catch (error) {
    console.error(error);
  }
};
