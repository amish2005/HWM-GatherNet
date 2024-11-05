const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventName: {
      type: String,
      required: true,
    },
    eventStartDate: {
      type: Date,
      required: true,
    },
    eventEndDate: {
      type: Date,
      required: true,
      
    },
    coordinates: {
        type: { type: String, enum: ['Point'], required: true, },
        coordinates: { type: [Number], required: true } // [longitude, latitude]
    },
    eventDetails: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    locationName: {
        type: String,
        require: true,
    },
    eventThumbnail: {
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

  eventSchema.index({ coordinates: '2dsphere' });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
