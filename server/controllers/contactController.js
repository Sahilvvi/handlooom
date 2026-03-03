const Contact = require('../models/Contact');
const { sendContactReply } = require('../services/emailService');

exports.submitContact = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        if (!name || !email || !message) return res.status(400).json({ message: 'Name, email, and message are required' });

        const contactDoc = new Contact({ name, email, phone, subject, message });
        await contactDoc.save();

        // Send email (non-blocking)
        sendContactReply({ name, email, phone, subject, message });

        res.status(201).json({ message: 'Message received! We will contact you within 24 hours.' });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.markRead = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        res.json(contact);
    } catch (err) { res.status(500).json({ message: err.message }); }
};
