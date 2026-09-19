const mongoose = require('mongoose');

const destinationInfoSchema = new mongoose.Schema({
    cityName: { type: String, required: true, unique: true },
    country: { type: String, required: true },
    currencyCode: { type: String, default: 'EUR' },
    exchangeRateToMKD: { type: Number, default: 61.5 },
    avgTemperature: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('DestinationInfo', destinationInfoSchema);