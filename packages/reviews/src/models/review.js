const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    locationId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    text: {
        type: String,
        required: false,
        trim: true,
        maxlength: 250
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    rating: {
        type: Number,
        required: true,
        enum: [0, 1, 2, 3, 4, 5],
        default: undefined
    }
}, {
    timestamps: true
})


const Review = mongoose.model('Review', reviewSchema)

module.exports = Review

