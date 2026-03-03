const Banner = require('../models/Banner');

exports.getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.find({ isActive: true }).sort({ sortOrder: 1 });
        res.json(banners);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getAllBannersAdmin = async (req, res) => {
    try {
        const banners = await Banner.find().sort({ sortOrder: 1 });
        res.json(banners);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createBanner = async (req, res) => {
    try {
        const banner = new Banner(req.body);
        await banner.save();
        res.status(201).json(banner);
    } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.updateBanner = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(banner);
    } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteBanner = async (req, res) => {
    try {
        await Banner.findByIdAndDelete(req.params.id);
        res.json({ message: 'Banner deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
};
