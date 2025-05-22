const forgotPasswordTemplate = (resetUrl, userName) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
</head>
<body style="background-color: #f3f4f6; padding: 20px; font-family: Arial, sans-serif;">
    <div style="max-width: 600px; background-color: #ffffff; padding: 20px; margin: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); text-align: center;">
        <img src="https://drive.google.com/uc?export=view&id=1tbJ5EQFp5YN9NQGknOLyr0HqixqPmPWk" alt="Milky Fresh Dairies Logo" style="max-width: 150px; margin: 20px auto; display: block;">
        
        <h2 style="color: #20a39e;">Password Reset Request</h2>
        <p>Hi <strong>${userName}</strong>,</p>
        <p>You recently requested to reset your password. Click the button below to reset it:</p>
        
        <div style="margin-top: 20px;">
            <a href="${resetUrl}" style="background-color: #20a39e; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold; display: inline-block;">
                Reset Password
            </a>
        </div>

        <p style="margin-top: 20px;">If you did not request this, please ignore this email.</p>
        <p>Thank you,<br/>Milky Fresh Dairies</p>
    </div>
</body>
</html>
`;

module.exports = forgotPasswordTemplate;
