const fs = require('fs');
const sendEmail = require('../utils/emailServer');
const invoiceTemplate = require('../emailTemplates/invoiceTemplate'); // Adjust path if needed

exports.sendInvoice = async (req, res) => {
  try {
    const { email, name } = req.body;
    const file = req.file;

    if (!email || !file) {
      return res.status(400).json({ message: 'Email and invoice file are required.' });
    }

    const html = invoiceTemplate(name); // Pass the name into the template

    await sendEmail({
      email,
      subject: 'Your Payment Invoice',
      text: 'Thank you for your order! Please find your invoice attached.',
      html, // Styled HTML
      attachments: [
        {
          filename: file.originalname,
          content: fs.createReadStream(file.path),
        },
      ],
    });

    fs.unlinkSync(file.path);

    res.status(200).json({ message: 'Invoice sent successfully!' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ message: 'Failed to send invoice email.' });
  }
};
