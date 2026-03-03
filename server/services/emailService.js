const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS   // App password (not regular password)
    }
});

const sendOrderConfirmation = async (order) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
    try {
        const itemsHtml = (order.items || []).map(i =>
            `<tr><td style="padding:8px;border-bottom:1px solid #f0f0f0">${i.name}</td><td style="padding:8px;border-bottom:1px solid #f0f0f0" align="right">x${i.quantity}</td><td style="padding:8px;border-bottom:1px solid #f0f0f0" align="right">₹${(i.price * i.quantity).toLocaleString('en-IN')}</td></tr>`
        ).join('');

        await transporter.sendMail({
            from: `"Jannat Handloom" <${process.env.EMAIL_USER}>`,
            to: order.shippingAddress?.email,
            subject: `✅ Order Confirmed — ${order.orderNumber}`,
            html: `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
                    <div style="background:#1e293b;padding:24px;text-align:center">
                        <h1 style="color:white;margin:0;letter-spacing:3px">JANNAT HANDLOOM</h1>
                    </div>
                    <div style="padding:32px;background:#ffffff">
                        <h2 style="color:#EF6F31">Order Confirmed! 🎉</h2>
                        <p>Hi ${order.shippingAddress?.firstName}, thank you for your order!</p>
                        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                        <p><strong>Payment Mode:</strong> ${order.paymentMode}</p>
                        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:4px;margin:20px 0">
                            <thead><tr style="background:#f8f8f8"><th align="left" style="padding:10px">Item</th><th align="right" style="padding:10px">Qty</th><th align="right" style="padding:10px">Amount</th></tr></thead>
                            <tbody>${itemsHtml}</tbody>
                            <tfoot><tr><td colspan="2" style="padding:12px;font-weight:bold">Total</td><td align="right" style="padding:12px;font-weight:bold;color:#EF6F31">₹${(order.totalAmount || 0).toLocaleString('en-IN')}</td></tr></tfoot>
                        </table>
                        <p style="color:#666">Delivery to ${order.shippingAddress?.address}, ${order.shippingAddress?.city}, ${order.shippingAddress?.pincode}</p>
                        <p style="color:#666">Expected delivery: 5-7 business days</p>
                        <p>Questions? Email us at help@jannatloom.com</p>
                    </div>
                    <div style="background:#f8f8f8;padding:16px;text-align:center;color:#999;font-size:12px">
                        © 2026 Jannat Handloom. All rights reserved.
                    </div>
                </div>`
        });
        console.log('✅ Order confirmation email sent to', order.shippingAddress?.email);
    } catch (err) {
        console.error('❌ Email send failed (non-critical):', err.message);
    }
};

const sendContactReply = async (contactData) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
    try {
        // Notify admin
        await transporter.sendMail({
            from: `"Jannat Handloom Website" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: `📬 New Contact Form: ${contactData.subject || 'General Enquiry'}`,
            html: `<p><strong>From:</strong> ${contactData.name} (${contactData.email})</p><p><strong>Phone:</strong> ${contactData.phone || 'N/A'}</p><p><strong>Message:</strong></p><p>${contactData.message}</p>`
        });
        // Auto-reply to sender
        await transporter.sendMail({
            from: `"Jannat Handloom" <${process.env.EMAIL_USER}>`,
            to: contactData.email,
            subject: 'We received your message — Jannat Handloom',
            html: `<div style="font-family:Arial,sans-serif;max-width:500px"><h2 style="color:#EF6F31">Thank you, ${contactData.name}!</h2><p>We've received your message and will get back to you within 24 hours.</p><p style="color:#666">Your message: "${contactData.message}"</p><p>📞 +91 98765 43210<br>📧 help@jannatloom.com</p></div>`
        });
    } catch (err) {
        console.error('❌ Contact email failed (non-critical):', err.message);
    }
};

module.exports = { sendOrderConfirmation, sendContactReply };
