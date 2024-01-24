const productCollection = require("../models/productModels");
const productOfferCollection = require("../models/productOfferModel");

module.exports = {
  applyProductOffer: async (from) => {
    try {
      // updating the currentStatus field of productOfferCollection by checking with the current date
      let productOfferData = await productOfferCollection.find();
      productOfferData.forEach(async (v) => {
        await productOfferCollection.updateOne(
          { _id: v._id },
          {
            $set: {
              currentStatus:
                v.endDate >= new Date() && v.startDate <= new Date(),
            },
          }
        );
      });

      let productData = await productCollection.find();
      productData.forEach(async (v) => {
        let offerExists = await productOfferCollection.findOne({
          productId: v._id,
          currentStatus: true,
        });

        if (offerExists) {
          offerExistsAndActiveFn(v, offerExists, from);
        }

        let offerExistsAndInactive = await productOfferCollection.findOne({
          productId: v._id,
          currentStatus: false,
        });

        if (offerExistsAndInactive) {
          offerExistsAndInactiveFn(v, from);
        }
      });
    } catch (error) {
      console.error(error);
    }
  },
};

async function offerExistsAndActiveFn(v, offerExists, from) {
  let { productOfferPercentage } = offerExists;
  if (from == "addOffer") {
    let productPrice = Math.round(
      v.productPrice * (1 - productOfferPercentage * 0.01)
    );
    await productCollection.updateOne(
      { _id: v._id },
      {
        $set: {
          productPrice,
          productOfferId: offerExists._id,
          productOfferPercentage,
          priceBeforeOffer: v.productPrice,
        },
      }
    );
  } else if (from == "editOffer" || "landingPage") {
    let productPrice = Math.round(
      v.priceBeforeOffer * (1 - productOfferPercentage * 0.01)
    );
    await productCollection.updateOne(
      { _id: v._id },
      {
        $set: {
          productPrice,
          productOfferId: offerExists._id,
          productOfferPercentage,
        },
      }
    );
  }
}

async function offerExistsAndInactiveFn(v, from) {
  if (from == "editOffer" || "landingPage") {
    let productPrice = v.priceBeforeOffer;
    await productCollection.updateOne(
      { _id: v._id },
      {
        $set: {
          productPrice,
          productOfferId: null,
          productOfferPercentage: null,
        },
      }
    );
  }
}
