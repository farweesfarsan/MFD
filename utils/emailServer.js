// email.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transport = {
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.EMAIL_SERVER_PASS,
        },
    };

    const transporter = nodemailer.createTransport(transport);

    const message = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.EMAIL_FROM}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(message);
};

module.exports = sendEmail;