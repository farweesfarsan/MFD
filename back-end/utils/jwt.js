const { path } = require("../app");

const sendToken = (user, statusCode, res) => {
    const token = user.getJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE_DATE * 24 * 60 * 60 * 1000),
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', // Ensure Secure in production
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // Important for cross-origin cookies
        domain: 'localhost', // Change to your domain in production
    };

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user
        });
};

module.exports = sendToken;
