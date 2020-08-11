const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: false,
        trim: true,
        maxlength: 100
    },
    additionalInfo: {
        type: String,
        required: false,
        trim: true,
        maxlength: 100
    },
    location: {
        // GeoJSON Point
        type: {
          type: String,
          enum: ['Point']
        },
        coordinates: {
          type: [Number],
          index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    },
    approvedAt: {
        type: Date,
        required: false,
        default: Date.now()
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    },
    averageRating: {
        type: Number,
        required: false,
        enum: [0, 1, 2, 3, 4, 5],
        default: undefined
    }
}, {
    timestamps: true
})

locationSchema.methods.toJSON = function () {
    const location = this
    const locationObject = location.toObject()

    delete locationObject.approvedAt
    delete locationObject.approvedBy
    delete locationObject.updatedBy
    delete locationObject.createdBy



    return locationObject
}

const Location = mongoose.model('Location', locationSchema)

module.exports = Location

