const mongoose = require('mongoose');

const attractionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    category: { type: String },
    description: { type: String },
    details: { type: String },
    price: { type: Number, default: 0 },
    currency: { type: String, default: 'EUR' }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Виртуелно поле кое автоматски ги спојува цената и симболот/валутата
attractionSchema.virtual('formattedPrice').get(function() {
    if (!this.price || this.price === 0) {
        return 'Бесплатно';
    }
    const symbol = this.currency === 'EUR' ? '€' : this.currency;
    return `${this.price} ${symbol}`;
});

module.exports = mongoose.model('Attraction', attractionSchema);