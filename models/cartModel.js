const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, required: true },
  cartProducts: [
    {
      productId: { type: mongoose.Types.ObjectId, required: true },
      productName: { type: String, required: true },
      productImage: { type: String, required: true },
      productPrice: { type: Number, required: true },
      productQuantity: { type: Number, required: true, default: 1},
    },
  ],
});

const cartCollection= mongoose.model( 'carts', cartSchema )

module.exports= cartCollection