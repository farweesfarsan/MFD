
const nodemailer = require('nodemailer');
const forgotPasswordTemplate = require('../emailTemplates/forgotPasswordTemplate');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: 'localhost',    // MailDev SMTP host
        port: 1025,           // MailDev SMTP port
        ignoreTLS: true       // MailDev does not use TLS
    });

    const message = {
        from: `"${process.env.SMTP_FROM_NAME || 'Test App'}" <${process.env.EMAIL_FROM || 'no-reply@test.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.text || '',
        html: options.html || '',
        attachments: options.attachments || [],
    };

    await transporter.sendMail(message);
};

module.exports = sendEmail;

