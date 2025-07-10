// const fs = require('fs');
// const sendEmail = require('../utils/emailServer');
// const invoiceTemplate = require('../emailTemplates/invoiceTemplate'); // Adjust path if needed

// exports.sendInvoice = async (req, res) => {
//   try {
//     const { email, name } = req.body;
//     const file = req.file;

//     if (!email || !file) {
//       return res.status(400).json({ message: 'Email and invoice file are required.' });
//     }


//     const myOrders = `${process.env.FRONTEND_URL}/myProfile/orders`

//     const html = invoiceTemplate(myOrders,name); // Pass the name into the template

//     await sendEmail({
//       email,
//       subject: 'Your Payment Invoice',
//       text: 'Thank you for your order! Please find your invoice attached.',
//       html, // Styled HTML
//       attachments: [
//         {
//           filename: file.originalname,
//           content: fs.createReadStream(file.path),
//         },
//       ],
//     });

//     fs.unlinkSync(file.path);

//     res.status(200).json({ message: 'Check Your Email!' });
//   } catch (error) {
//     console.error('Email sending error:', error);
//     res.status(500).json({ message: 'Failed to send invoice email.' });
//   }
// };
const fs = require('fs');
const sendEmail = require('../utils/emailServer');
const invoiceTemplate = require('../emailTemplates/invoiceTemplate'); // Adjust path if needed
const { liveStaffMap } = require('../ws/websocketManager');

exports.sendInvoice = async (req, res) => {
  try {
    const { email, name } = req.body;
    const file = req.file;

    if (!email || !file) {
      return res.status(400).json({ message: 'Email and invoice file are required.' });
    }


    const myOrders = `${process.env.FRONTEND_URL}/myProfile/orders`

    const html = invoiceTemplate(myOrders,name); // Pass the name into the template

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
        for (const [staffId, staff] of liveStaffMap.entries()) {
      console.log(`Checking staff ${staffId}, ws readyState:`, staff.ws.readyState);

      if (staff.ws && staff.ws.readyState === 1) {
        console.log("Broadcasting to delivery staff...", liveStaffMap.size, "staff connected");

        staff.ws.send(JSON.stringify({
          type: 'new_order',
          message: 'New Order Received!',
          address: orderDetails.deliveryInfo.address,
          order: {
            orderId: orderDetails._id,
            orderItems: orderDetails.orderItems,
            phoneNo: orderDetails.deliveryInfo.phoneNo,
            city: orderDetails.deliveryInfo.city,
            totalPrice: orderDetails.totalPrice,
            finalPrice: orderDetails.finalPrice,
            status: orderDetails.orderStatus,
            userId: orderDetails.userId,
          },
        }));
      }
    }

    res.status(200).json({ message: 'Check Your Email!' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ message: 'Failed to send invoice email.' });
  }
};




// const fs = require('fs');
// const sendEmail = require('../utils/emailServer');
// const invoiceTemplate = require('../emailTemplates/invoiceTemplate');
// const { liveStaffMap } = require('../ws/websocketManager'); // Import the map

// exports.sendInvoice = async (req, res) => {
//   try {
//     const { email, name, orderDetails } = req.body; // Get order details
//     const file = req.file;

//     if (!email || !file || !orderDetails) {
//       return res.status(400).json({ message: 'Email, invoice file, and order details are required.' });
//     }

//     const myOrders = `${process.env.FRONTEND_URL}/myProfile/orders`;
//     const html = invoiceTemplate(myOrders, name);

//     await sendEmail({
//       email,
//       subject: 'Your Payment Invoice',
//       text: 'Thank you for your order! Please find your invoice attached.',
//       html,
//       attachments: [
//         {
//           filename: file.originalname,
//           content: fs.createReadStream(file.path),
//         },
//       ],
//     });

//     fs.unlinkSync(file.path);

//     // ✅ Broadcast to all connected delivery staff
//     for (const [staffId, staff] of liveStaffMap.entries()) {
//       console.log(`Checking staff ${staffId}, ws readyState:`, staff.ws.readyState);

//       if (staff.ws && staff.ws.readyState === 1) {
//         console.log("Broadcasting to delivery staff...", liveStaffMap.size, "staff connected");

//         staff.ws.send(JSON.stringify({
//           type: 'new_order',
//           message: 'New Order Received!',
//           address: orderDetails.deliveryInfo.address,
//           order: {
//             orderId: orderDetails._id,
//             orderItems: orderDetails.orderItems,
//             phoneNo: orderDetails.deliveryInfo.phoneNo,
//             city: orderDetails.deliveryInfo.city,
//             totalPrice: orderDetails.totalPrice,
//             finalPrice: orderDetails.finalPrice,
//             status: orderDetails.orderStatus,
//             userId: orderDetails.userId,
//           },
//         }));
//       }
//     }

//     res.status(200).json({ message: 'Check Your Email! Invoice sent and delivery staff notified.' });

//   } catch (error) {
//     console.error('Email sending error:', error);
//     res.status(500).json({ message: 'Failed to send invoice email.' });
//   }
// };

