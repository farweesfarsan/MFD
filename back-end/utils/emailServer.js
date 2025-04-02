// email.js
const nodemailer = require('nodemailer');
const forgotPasswordTemplate = require('../emailTemplates/forgotPasswordTemplate');

// const sendEmail = async (options) => {
//     const transporter = nodemailer.createTransport({
//         service: 'Gmail',
//         auth: {
//             user: process.env.EMAIL_FROM,
//             pass: process.env.EMAIL_SERVER_PASS,
//         },
//     });

//     const message = {
//         from: `${process.env.SMTP_FROM_NAME} <${process.env.EMAIL_FROM}>`,
//         to: options.email,
//         subject: options.subject,
//         html: forgotPasswordTemplate(options.resetUrl, options.userName), 
//     };

//     await transporter.sendMail(message);
// };

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
        html: options.html, // Accept different email templates dynamically
    };

    await transporter.sendMail(message);
};

module.exports = sendEmail;
