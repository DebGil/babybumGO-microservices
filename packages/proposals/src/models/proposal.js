const mongoose = require('mongoose')

const proposalSchema = new mongoose.Schema({
    locationId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: false,
        trim: true
    },
    address: {
        type: String,
        required: false,
        trim: false,
        maxlength: 100
    },
    additionalInfo: {
        type: String,
        required: false,
        trim: true,
        maxlength: 100
    },
    location: {
        required: false,
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
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        required: false,
        default: 'Under Review',
        enum: ['Under Review', 'Rejected', 'Approved']
    },
    expireAt: {
        type: Date, 
        default: undefined
    }
}, {
    timestamps: true
})



// proposalSchema.methods.toJSON = function () {
//     const proposal = this
//     const proposalObject = proposal.toObject()

//     delete proposalObject.locationId
//     delete proposalObject.name
//     delete proposalObject.address
//     delete proposalObject.additionalInfo
//     delete proposalObject.location
//     delete proposalObject.createdBy
//     delete proposalObject.updatedBy
//     // delete proposalObject._id
//     delete proposalObject.createdAt
//     delete proposalObject.updatedAt
//     delete proposalObject.__v


//     return proposalObject
// }

proposalSchema.index({ "expireAt": 1 }, { expireAfterSeconds: 60 });

const Proposal = mongoose.model('Proposal', proposalSchema)

module.exports = Proposal