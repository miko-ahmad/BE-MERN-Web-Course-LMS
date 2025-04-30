import mongoose from "mongoose";

const trancastionModel = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending'
    },
    
}, {
    timestamps: true
}
)

export default mongoose.model("Transaction". trancastionModel)