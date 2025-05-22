// email.js
const nodemailer = require('nodemailer');
const forgotPasswordTemplate = require('../emailTemplates/forgotPasswordTemplate');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.EMAIL_SERVER_PASS,
        },
    });

    const message = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.EMAIL_FROM}>`,
        to: options.email,
        subject: options.subject,
        text: options.text || '',
        html: options.html || '',
        attachments: options.attachments || [],
    };

    await transporter.sendMail(message);
};

module.exports = sendEmail;
