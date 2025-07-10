// const WebSocket = require('ws');
// const liveStaffMap = new Map();

// function setupWebSocket(server) {
//     const wss = new WebSocket.Server({ server }); 

//     wss.on('connection', (ws) => {
//         ws.on('message', (msg) => { 
//             try {
//                 const data = JSON.parse(msg);
//                 if (data.type === 'location_update') {
//                     liveStaffMap.set(data.staffId, { lat: data.lat, lon: data.lon, ws });
//                 }
//             } catch (error) {
//                 console.log("Invalid web socket message", error);
//             }
//         });

//         ws.on('close', () => {
//             for (const [id, staff] of liveStaffMap.entries()) {
//                 if (staff.ws === ws) liveStaffMap.delete(id);
//             }
//         });
//     });

//     return {
//         wss,
//         liveStaffMap
//     };
// }

// module.exports = { setupWebSocket, liveStaffMap };
// Updated WebSocket Setup (server-side)
// === ✅ Updated WebSocket Server Setup (websocket.js) ===
// const WebSocket = require('ws');
// const liveStaffMap = new Map();

// function setupWebSocket(server) {
//   const wss = new WebSocket.Server({ server });

//   wss.on('connection', (ws) => {
//     ws.on('message', (msg) => {
//       try {
//         const data = JSON.parse(msg);

//         if (data.type === 'register_staff') {
//           // Register delivery staff by ID
//           liveStaffMap.set(data.staffId, { ws });
//           console.log(`✅ Staff registered: ${data.staffId}`);
//         }

//         if (data.type === 'location_update') {
//           if (liveStaffMap.has(data.staffId)) {
//             liveStaffMap.get(data.staffId).lat = data.lat;
//             liveStaffMap.get(data.staffId).lon = data.lon;
//           } else {
//             liveStaffMap.set(data.staffId, { lat: data.lat, lon: data.lon, ws });
//           }
//         }
//       } catch (error) {
//         console.error("❌ Invalid WebSocket message", error);
//       }
//     });

//     ws.on('close', () => {
//       for (const [id, staff] of liveStaffMap.entries()) {
//         if (staff.ws === ws) liveStaffMap.delete(id);
//       }
//     });
//   });

//   return {
//     wss,
//     liveStaffMap
//   };
// }

// module.exports = { setupWebSocket, liveStaffMap };
// ws/websocketManager.js
const WebSocket = require('ws');

// This Map holds connected delivery staff by staffId => { ws }
const liveStaffMap = new Map();

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('WebSocket connection established');

    ws.on('message', (msg) => {
      try {
        const data = JSON.parse(msg);
        console.log('Received message:', data);

        if (data.type === 'register_staff') {
          // Register staff with ID
          liveStaffMap.set(data.staffId, { ws });
          console.log(`Registered delivery staff: ${data.staffId}`);
        }

      } catch (err) {
        console.error('Invalid WebSocket message:', err);
      }
    });

    ws.on('close', () => {
      for (const [id, staff] of liveStaffMap.entries()) {
        if (staff.ws === ws) {
          liveStaffMap.delete(id);
          console.log(`Disconnected: Staff ${id}`);
        }
      }
    });
  });

  return {
    wss,
    liveStaffMap
  };
}

module.exports = { setupWebSocket, liveStaffMap };
