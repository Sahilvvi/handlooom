const mongoose = require('mongoose');

const homeSettingsSchema = new mongoose.Schema({
    heroSlides: [{
        image: String,
        label: String,
        title: String,
        subtitle: String,
        cta: String,
        link: { type: String, default: '/shop' }
    }],
    categories: [{
        name: String,
        subtitle: String,
        image: String,
        link: String
    }],
    promoBanners: [{
        title: String,
        subtitle: String,
        image: String,
        link: { type: String, default: '/shop' }
    }],
    rooms: [{
        name: String,
        image: String,
        link: String
    }],
    colors: [{
        name: String,
        image: String,
        link: String
    }],
    materials: [{
        name: String,
        image: String,
        link: String
    }],
    footerAbout: String,
    contactInfo: {
        address: String,
        phone: String,
        email: String
    }
}, { timestamps: true });

module.exports = mongoose.model('HomeSettings', homeSettingsSchema);
