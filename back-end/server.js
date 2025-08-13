// const app = require('./app'); 
// const http = require('http');
// const path = require('path');
// const connectionDB = require('./config/db');
// const { setupWebSocket } = require('./ws/websocketManager');

// connectionDB();

// const srv = http.createServer(app); // <-- correct server instance
// setupWebSocket(srv);                // <-- WebSocket attached

// // Start the same server
// const server = srv.listen(process.env.PORT, () => {
//   console.log(`Server is running on port: ${process.env.PORT} in ${process.env.NODE_ENV}`);
// });

// process.on('unhandledRejection', (err) => {
//   console.log(`Error: ${err.message}`);
//   console.log("Shutting down the server due to unhandled rejection error");
//   server.close(() => process.exit());
// });

// process.on('uncaughtException', (err) => {
//   console.log(`Error: ${err.message}`);
//   console.log("Shutting down the server due to uncaught exception error");
//   server.close(() => process.exit());
// });
// const app = require('./app');
// const http = require('http');
// const path = require('path');
// const connectionDB = require('./config/db');
// const { Server } = require('socket.io');
// const notificationRoutes = require('./routes/notification');
// const socketManager = require('./sockets');

// connectionDB();

// const srv = http.createServer(app); // Create HTTP server

// const io = new Server(server, {
//   cors: {
//     origin: '*',
//   }
// });

// // Register socket events
// socketManager(io);
// // Routes
// app.use('/api/notifications', notificationRoutes(io));

// // Default route
// app.get('/', (req, res) => {
//   res.send('Socket.IO Server is running');
// });

// // Start server
// const server = srv.listen(process.env.PORT, () => {
//   console.log(`Server is running on port: ${process.env.PORT} in ${process.env.NODE_ENV}`);
// });

// // Handle process errors
// process.on('unhandledRejection', (err) => {
//   console.log(`Error: ${err.message}`);
//   console.log("Shutting down the server due to unhandled rejection error");
//   server.close(() => process.exit());
// });

// process.on('uncaughtException', (err) => {
//   console.log(`Error: ${err.message}`);
//   console.log("Shutting down the server due to uncaught exception error");
//   server.close(() => process.exit());
// });
const app = require('./app');
const http = require('http');
const path = require('path');
const connectionDB = require('./config/db');
const { setupSocketIO } = require('./socket/socketHandler'); 

connectionDB();

const srv = http.createServer(app); // Create HTTP server

// Setup Socket.IO
setupSocketIO(srv);

// Start server
const server = srv.listen(process.env.PORT, () => {
  console.log(`Server is running on port: ${process.env.PORT} in ${process.env.NODE_ENV}`);
});

// Handle process errors
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to unhandled rejection error");
  server.close(() => process.exit());
});

process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to uncaught exception error");
  server.close(() => process.exit());
});
