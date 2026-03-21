const sgMail = require('@sendgrid/mail');
require('dotenv').config();

if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
    console.warn('⚠️ SENDGRID_API_KEY NOT SET IN .ENV. EMAIL NOTIFICATION WILL BE MOCKED.');
}

// Global Order Notification Utility
exports.sendOrderConfirmation = async (order) => {
    if (!process.env.SENDGRID_API_KEY) {
        console.log('📬 [MOCK EMAIL] To:', order.shippingAddress.email, '| Subject: Order Confirmed', order.orderNumber);
        return;
    }

    const { shippingAddress, items, totalAmount, orderNumber } = order;

    const msg = {
        to: shippingAddress.email,
        from: 'concierge@jannatloom.com', // Must be verified in SendGrid
        subject: `Your Jannat Handloom Order #${orderNumber} is Confirmed`,
        html: `
            <div style="font-family: Arial, sans-serif; border: 1px solid #eee; padding: 20px; max-width: 600px;">
                <h2 style="color: #1a1a1a;">Thank you for your order, ${shippingAddress.firstName}!</h2>
                <p>We are weaving your artisanal collection with care. Here is your order summary:</p>
                <hr style="border: 0; border-top: 1px solid #eee;">
                <h3>Order #${orderNumber}</h3>
                <ul>
                    ${items.map(i => `<li>${i.name} (x${i.quantity}) - ₹${i.price}</li>`).join('')}
                </ul>
                <p><strong>Total Amount Paid:</strong> ₹${totalAmount}</p>
                <hr style="border: 0; border-top: 1px solid #eee;">
                <p>We will notify you once it's shipped.</p>
                <p>Warmest Regards,<br><strong>Jannat Handloom Concierge</strong></p>
            </div>
        `
    };

    try {
        await sgMail.send(msg);
        console.log('✅ Email sent to', shippingAddress.email);
    } catch (err) {
        console.error('❌ SendGrid Error:', err.response?.body || err.message);
    }
};
