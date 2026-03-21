const sgMail = require('@sendgrid/mail');
require('dotenv').config();

if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const sendOrderConfirmation = async (order) => {
    if (!process.env.SENDGRID_API_KEY) {
        console.log('📬 [MOCK EMAIL] Order Confirmed:', order.orderNumber);
        return;
    }
    try {
        const itemsHtml = (order.items || []).map(i =>
            `<tr><td style="padding:8px;border-bottom:1px solid #f0f0f0">${i.name}</td><td style="padding:8px;border-bottom:1px solid #f0f0f0" align="right">x${i.quantity}</td><td style="padding:8px;border-bottom:1px solid #f0f0f0" align="right">₹${(i.price * i.quantity).toLocaleString('en-IN')}</td></tr>`
        ).join('');

        await sgMail.send({
            to: order.shippingAddress?.email,
            from: 'concierge@jannatloom.com', // Must be verified in SendGrid
            subject: `✅ Order Confirmed — ${order.orderNumber}`,
            html: `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
                    <div style="background:#1e293b;padding:24px;text-align:center">
                        <h1 style="color:white;margin:0;letter-spacing:3px">JANNAT HANDLOOM</h1>
                    </div>
                    <div style="padding:32px;background:#ffffff">
                        <h2 style="color:#C5A059">Order Confirmed! 🎉</h2>
                        <p>Hi ${order.shippingAddress?.firstName}, thank you for your order!</p>
                        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                        <p><strong>Payment Mode:</strong> ${order.paymentMode}</p>
                        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:4px;margin:20px 0">
                            <thead><tr style="background:#f8f8f8"><th align="left" style="padding:10px">Item</th><th align="right" style="padding:10px">Qty</th><th align="right" style="padding:10px">Amount</th></tr></thead>
                            <tbody>${itemsHtml}</tbody>
                            <tfoot><tr><td colspan="2" style="padding:12px;font-weight:bold">Total</td><td align="right" style="padding:12px;font-weight:bold;color:#C5A059">₹${(order.totalAmount || 0).toLocaleString('en-IN')}</td></tr></tfoot>
                        </table>
                        <p style="color:#666">Delivery to ${order.shippingAddress?.address}, ${order.shippingAddress?.city}</p>
                        <p>Questions? Email us at concierge@jannatloom.com</p>
                    </div>
                </div>`
        });
    } catch (err) {
        console.error('❌ SendGrid Error (Order):', err.response?.body || err.message);
    }
};

const sendContactReply = async (contactData) => {
    if (!process.env.SENDGRID_API_KEY) return;
    try {
        await sgMail.send({
            to: contactData.email,
            from: 'concierge@jannatloom.com',
            subject: 'We received your message — Jannat Handloom',
            html: `<div style="font-family:Arial,sans-serif;max-width:500px"><h2>Thank you, ${contactData.name}!</h2><p>We've received your inquiry regarding <strong>${contactData.subject}</strong> and will get back to you within 24 hours.</p></div>`
        });
    } catch (err) {
        console.error('❌ SendGrid Error (Contact):', err.response?.body || err.message);
    }
};

module.exports = { sendOrderConfirmation, sendContactReply };
