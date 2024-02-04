const mongoose= require('mongoose')

const walletSchema= new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, required: true, ref:'users'},
    walletBalance: { type: Number, default: 0 },
    walletTransaction: [
        {
            transactionDate: { type: Date, default : new Date()  },
            transactionAmount: { type: Number   },
            transactionType: { type: String }
        }
    ]
})

const walletCollection= mongoose.model('wallets', walletSchema)

module.exports = walletCollection