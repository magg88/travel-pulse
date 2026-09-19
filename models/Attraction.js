const mongoose = require('mongoose');

const attractionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    price: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Attraction', attractionSchema);