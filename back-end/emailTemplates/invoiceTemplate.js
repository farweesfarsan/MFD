const invoiceTemplate = (name = 'Customer') => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice</title>
</head>
<body style="background-color: #f3f4f6; padding: 20px; font-family: Arial, sans-serif;">
    <div style="max-width: 600px; background-color: #ffffff; padding: 20px; margin: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); text-align: center;">
        <img src="https://drive.google.com/uc?export=view&id=1tbJ5EQFp5YN9NQGknOLyr0HqixqPmPWk"
         alt="Milky Fresh Dairies Logo" style="max-width: 150px; margin: 20px auto; display: block;">
        
        <h2 style="color: #2d3748;">Hi ${name},</h2>
        <p style="font-size: 16px; color: #4a5568;">
          Thank you for your order. Please find your invoice attached below.
        </p>
        <p style="font-size: 14px; color: #718096;">
          Your order will be assigned to a delivery staff member, and you’ll be notified with their contact information to help you track the delivery.
          <br />
          If you do not receive any notification, please feel free to contact us at <strong>0112 552 565</strong>.
        </p>
        <p style="font-size: 14px; color: #718096;">
          If you have any other questions, feel free to reply to this email. We’re happy to help!
        </p>

        <br />
        <p style="font-size: 14px; color: #718096;">– Milky Fresh Dairies(MFD)</p>
        <p style="font-size: 14px; color: #718096;>52, Dharmarama Road, Colombo 06</p>
    </div>
</body>
</html>
`;

module.exports = invoiceTemplate;
