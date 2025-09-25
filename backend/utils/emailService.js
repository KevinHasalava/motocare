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

// Function එකට දත්ත ලැබෙන ආකාරය සරල කර ඇත
const sendBookingConfirmationEmail = async (data) => {
    const { user, vehicle, service, bookingDetails, jobDetails } = data;

    const formattedDate = dayjs(bookingDetails.date).format('dddd, MMMM D, YYYY');
    const formattedTime = dayjs(bookingDetails.date).format('h:mm A');

    try {
        await transporter.sendMail({
            from: '"Moto-Care" <kasunmunasinghe745@gmail.com>',
            to: user.email,
            subject: `✅ Booking Confirmed: Your Job ID is ${jobDetails.jobId}`, // 👈 Job ID එක Subject එකට ඇතුළත් කර ඇත
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

module.exports = { sendBookingConfirmationEmail };