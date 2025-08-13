// ws/websocketManager.js
const WebSocket = require('ws');

// Holds connected delivery staff { staffId: WebSocket }
const liveStaffMap = new Map();

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('WebSocket connection established');

    ws.on('message', (msg) => {
      try {
        const data = JSON.parse(msg);
        console.log('Received message:', data);

        if (data.type === 'register_staff' && data.staffId) {
          liveStaffMap.set(data.staffId, ws);
          console.log(`Registered delivery staff: ${data.staffId}`);
        }

      } catch (err) {
        console.error('Invalid WebSocket message:', err);
      }
    });

    ws.on('close', () => {
      for (const [staffId, s] of liveStaffMap.entries()) {
        if (s === ws) {
          liveStaffMap.delete(staffId);
          console.log(`Disconnected delivery staff: ${staffId}`);
          break;
        }
      }
    });
  });

  return {
    wss,
    liveStaffMap
  };
}

// Notify all delivery staff about a new order
function notifyDeliveryStaff(order) {
  for (const [staffId, ws] of liveStaffMap.entries()) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'new_order',
        message: `New order #${order.id} has been placed!`,
        orderId: order.id
      }));
    }
  }
}

module.exports = {
  setupWebSocket,
  liveStaffMap,
  notifyDeliveryStaff
};
