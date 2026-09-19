const mongoose = require('mongoose');

const itineraryItemSchema = new mongoose.Schema({
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    dayNumber: { type: Number, required: true },
    title: { type: String, required: true },
    time: { type: String, required: true },
    notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('ItineraryItem', itineraryItemSchema);