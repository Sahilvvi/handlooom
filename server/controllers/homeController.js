const HomeSettings = require('../models/HomeSettings');

// @desc    Get homepage settings
// @route   GET /api/home
// @access  Public
exports.getHomeSettings = async (req, res) => {
    try {
        let settings = await HomeSettings.findOne();
        if (!settings) {
            // Return empty if none
            return res.json({
                heroSlides: [],
                categories: [],
                promoBanners: [],
                rooms: []
            });
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Server error retrieving home settings' });
    }
};

// @desc    Update homepage settings
// @route   PUT /api/home
// @access  Private/Admin
exports.updateHomeSettings = async (req, res) => {
    try {
        let settings = await HomeSettings.findOne();
        if (settings) {
            settings = await HomeSettings.findOneAndUpdate({}, req.body, { new: true });
        } else {
            settings = await HomeSettings.create(req.body);
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Server error updating home settings' });
    }
};
