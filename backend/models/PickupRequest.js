const mongoose = require('mongoose');

const pickupRequestSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    wasteId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false, // Optional link to a specific report
      ref: 'WasteReport',
    },
    preferredDate: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
    coordinates: {
      lat: Number,
      lng: Number,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'completed', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const PickupRequest = mongoose.model('PickupRequest', pickupRequestSchema);

module.exports = PickupRequest;
