const nodemailer = require('nodemailer');
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3002;

app.use(bodyparser.json());

const corsoption = {
    origin: 'http://localhost:3000',
};

app.use(cors(corsoption));

const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_SERVER_PASS
    }
});

const sendEmail = async (emailOption) => {
    try {
        await transport.sendMail(emailOption);
        console.log('Email sent successfully');
    } catch (error) {
        console.log('Error is', error);
        throw error;
    }
};

app.post('/api/sendEmail', async (req, res) => {
    const { email } = req.body;

    // Generate a four-digit code
    const code = Math.floor(1000 + Math.random() * 9000).toString();

    const emailOption = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Your Verification Code',
        text: `Your verification code is ${code}`
    };

    try {
        await sendEmail(emailOption);
        // res.status(200).send({ message: 'Email sent successfully', code }); //~ Send the code back in the response
        res.status(200).json({code})
    } catch (error) {
        console.log('Error sending email', error);
        res.status(500).send('Error sending email');
    }
});

const startMailServer = () => {
    app.listen(port, () => {
        console.log(`Mail server is running on port ${port}`);
    });
};

module.exports = startMailServer;