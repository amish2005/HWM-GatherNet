const mongoose = require('mongoose');
const sportSchema = new mongoose.Schema({
    sportName: {
      type: String,
      required: true,
    },
    sportStartDate: {
      type: Date,
      required: true,
    },
    sportEndDate: {
      type: Date,
      required: true,
      
    },
    coordinates: {
        type: { type: String, enum: ['Point'], required: true, },
        coordinates: { type: [Number], required: true } // [longitude, latitude]
    },
    sportDetails: {
      type: String,
      required: true,
    },
    teamSize: {
        type: Number,
    },
    location: {
      type: String,
      required: true,
    },
    locationName: {
        type: String,
        require: true,
    },
    sportThumbnail: {
      type: String, // Store the file path as a string
      required: true,
    },
    likeCount: { type: Number, default: 0 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    additionalImages: [
      {
        type: String, // Store file paths for additional images
      },
    ],
  },{ timestamps: true });

  sportSchema.index({ coordinates: '2dsphere' });

const Sport = mongoose.model('Sport', sportSchema);

module.exports = Sport;