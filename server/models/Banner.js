const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    title: { type: String },
    subtitle: { type: String },
    image: { type: String, required: true },
    link: { type: String, default: '/shop' },
    buttonText: { type: String, default: 'Shop Now' },
    bgColor: { type: String, default: '#fff9f6' },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
