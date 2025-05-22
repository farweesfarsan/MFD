const otpEmailTemplate = (otp) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
</head>
<body style="background-color: #f3f4f6; padding: 20px; font-family: Arial, sans-serif;">
    <div style="max-width: 600px; background-color: #ffffff; padding: 20px; margin: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); text-align: center;">
        <img src="https://drive.google.com/uc?export=view&id=1tbJ5EQFp5YN9NQGknOLyr0HqixqPmPWk" alt="Milky Fresh Dairies Logo" style="max-width: 150px; margin: 20px auto; display: block;">
        
        <h2 style="color: #20a39e;">Your OTP Code for Verification</h2>
         
        <p>Use the OTP code below to verify your email. This code will expire in 10 minutes.</p>
        
        <div style="margin: 20px auto; padding: 15px; gap:10px; font-size: 20px; font-weight: bold; background-color: #20a39e; color: white; display: inline-block; border-radius: 5px;">
            ${otp}
        </div>

        <p>If you did not request this, please ignore this email.</p>
        <p>Thank you,<br/>Milky Fresh Dairies</p>
    </div>
</body>
</html>
`;

module.exports = otpEmailTemplate;
