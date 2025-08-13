// module.exports = (io) => {
//   io.on('connection', (socket) => {
//     console.log('User connected:', socket.id);

//     socket.on('joinGroup', (DeliveryStaff) => {
//       socket.join(DeliveryStaff);
//       console.log(`${socket.id} joined group ${DeliveryStaff}`);
//     });

//     socket.on('leaveGroup', (DeliveryStaff) => {
//       socket.leave(DeliveryStaff);
//       console.log(`${socket.id} left group ${DeliveryStaff}`);
//     });

//     socket.on('disconnect', () => {
//       console.log('User disconnected:', socket.id);
//     });
//   });
// };
let io;

const deliveryStaffSockets = new Map(); // userId -> socket

function setupSocketIO(server) {
  const { Server } = require('socket.io');
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Change if needed
      methods: ["GET", "POST"],
    },
  });

  io.on('connection', (socket) => {
    const { userId, role } = socket.handshake.query;

    if (role === 'DeliveryStaff') {
      deliveryStaffSockets.set(userId, socket);
      console.log(`DeliveryStaff connected: ${userId}`);

      socket.on('disconnect', () => {
        deliveryStaffSockets.delete(userId);
        console.log(`DeliveryStaff disconnected: ${userId}`);
      });
    }
  });
}

function notifyDeliveryStaff(order) {
  for (let [userId, socket] of deliveryStaffSockets) {
    socket.emit('newOrder', {
      message: 'A new order has been placed!',
  orderId: order._id,
  total: order.totalPrice,
  address: order.deliveryInfo?.address,
    });
  }
}

module.exports = {
  setupSocketIO,
  notifyDeliveryStaff,
};
