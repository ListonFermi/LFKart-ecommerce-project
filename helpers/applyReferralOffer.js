const userCollection = require("../models/userModels");
const walletCollection = require("../models/walletModel");

module.exports = async (referralCode) => {
  try {
    let referralCodeExists = await userCollection.findOne({ referralCode });

    if (referralCodeExists) {
      let walletTransaction = {
        transactionDate: new Date(),
        transactionAmount: 500,
        transactionType: "Referral offer credited",
      };

      await walletCollection.updateOne(
        { userId: referralCodeExists._id },
        { $inc: { walletBalance: 500 }, $push: {walletTransaction} }
      );

      console.log("Referral Applied");
    }
  } catch (error) {
    console.error(error);
  }
};
