const nodemailer = require('nodemailer');
const dayjs = require('dayjs');

const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
    }
});

const sendBookingConfirmationEmail = async (data) => {
    const { user, vehicle, service, bookingDetails, jobDetails } = data;

    const formattedDate = dayjs(bookingDetails.date).format('dddd, MMMM D, YYYY');
    const formattedTime = dayjs(bookingDetails.date).format('h:mm A');

    try {
        await transporter.sendMail({
            from: '"Moto-Care" <kasunmunasinghe745@gmail.com>',
            to: user.email,
            subject: `✅ Booking Confirmed: Your Job ID is ${jobDetails.jobId}`, // 💡 Changed to use jobId
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>Dear ${user.name},</h2>
                    <p>Your booking has been successfully confirmed!</p>
                    <p>Please find your booking details below:</p>
                    <hr>
                    <p><strong>Job ID:</strong> ${jobDetails.jobId}</p> <p><strong>Service:</strong> ${service.name}</p>
                    <p><strong>Vehicle:</strong> ${vehicle.brand} ${vehicle.model} (${vehicle.vehicleNumber})</p>
                    <p><strong>Date:</strong> ${formattedDate}</p>
                    <p><strong>Time:</strong> ${formattedTime}</p>
                    <hr>
                    <p>Thank you for choosing My Garage. We look forward to seeing you!</p>
                </div>
            `
        });
        console.log(`Booking confirmation email sent to ${user.email}`);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

const sendJobUpdateEmail = async (data) => {
    const { user, vehicle, service, jobDetails } = data;
    
    // Job එකේ නවතම date එක jobDetails.date වෙතින් ලැබේ
    const formattedDate = dayjs(jobDetails.date).format('dddd, MMMM D, YYYY');
    const formattedTime = dayjs(jobDetails.date).format('h:mm A');
    
    try {
        await transporter.sendMail({
            from: '"Moto-Care" <kasunmunasinghe745@gmail.com>',
            to: user.email,
            subject: `🔔 Job Updated: Changes to Job ID ${jobDetails.jobId}`, // 💡 Changed to use jobId
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>Dear ${user.name},</h2>
                    <p>Your service job details have been updated by our administration team. Please review the changes below:</p>
                    <hr>
                    <p><strong>Job ID:</strong> ${jobDetails.jobId}</p>
                    <p><strong>Service:</strong> ${service.name}</p>
                    <p><strong>Vehicle:</strong> ${vehicle.brand} ${vehicle.model} (${vehicle.vehicleNumber})</p>
                    <p><strong>New Date:</strong> ${formattedDate}</p>
                    <p><strong>New Time:</strong> ${formattedTime}</p>
                    <p><strong>Status:</strong> ${jobDetails.status}</p>
                    <hr>
                    <p>If you have any questions, please contact us immediately.</p>
                </div>
            `
        });
        console.log(`Job update email sent to ${user.email} for Job ID ${jobDetails.jobId}`);
    } catch (error) {
        console.error("Error sending job update email:", error);
    }
};


/**
 * Sends a low stock purchase request email to the specified supplier. (NEW FUNCTION)
 * This function is used by the purchaseRequestController.
 * @param {object} supplier - Object containing supplier's name and email.
 * @param {Array<object>} items - Array of { partName, quantityNeeded, currentStock }
 * @param {string} notes - Any extra notes from the user.
 */
const sendLowStockRequestEmail = async (supplier, items, notes) => {
    // 1. Generate the HTML table for requested items
    const itemsTable = items.map(item => `
        <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px; text-align: left;">${item.partName}</td>
            <td style="padding: 8px; text-align: right;">${item.currentStock}</td>
            <td style="padding: 8px; text-align: right; font-weight: bold;">${item.quantityNeeded}</td>
        </tr>
    `).join('');

    // 2. Determine email subject and recipient
    const subject = `Urgent Purchase Request: Parts Reorder - ${dayjs().format('YYYY-MM-DD')}`;

    try {
        await transporter.sendMail({
            from: '"My Garage Inventory" <kasunmunasinghe745@gmail.com>',
            to: supplier.email,
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #ccc; padding: 20px; border-radius: 8px;">
                    <h2 style="color: #333;">Purchase Order Request</h2>
                    <p>Dear ${supplier.name},</p>
                    <p>We are running low on the following inventory items and require a restock. Please confirm availability and pricing for these parts:</p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                        <thead>
                            <tr style="background-color: #f2f2f2;">
                                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ccc;">Part Name</th>
                                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ccc;">Current Stock</th>
                                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ccc;">Quantity Needed</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsTable}
                        </tbody>
                    </table>

                    <h3 style="margin-top: 25px;">Notes for Supplier:</h3>
                    <p style="border-left: 3px solid #007bff; padding-left: 10px; background-color: #f9f9f9;">
                        ${notes || 'No specific notes provided.'}
                    </p>

                    <p style="margin-top: 30px;">This request was generated on ${dayjs().format('MMMM D, YYYY')}.</p>
                    <p>Thank you for your prompt attention.</p>
                </div>
            `
        });
        console.log(`Low stock request email sent to ${supplier.email}`);
    } catch (error) {
        console.error("Error sending purchase request email:", error);
        // Important: Re-throw the error so the controller knows the email failed
        throw new Error("Email service failed to send the request.");
    }
};

module.exports = { 
    sendBookingConfirmationEmail, 
    sendJobUpdateEmail,
    sendLowStockRequestEmail // Export the new function
};
