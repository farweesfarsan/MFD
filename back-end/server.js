// const app = require('./app');

// const path = require('path');
// const connectionDB = require('./config/db');
// const { setupWebSocket } = require('./ws/websocketManager');


// connectionDB();



// const server = app.listen(process.env.PORT,()=>{
//     console.log(`Server is running on port: ${process.env.PORT} in ${process.env.NODE_ENV}`);
// })

// process.on('unhandledRejection',(err)=>{
//   console.log(`Error: ${err.message}`);
//   console.log("Shuting down the server due to unhandled rejection error");
//   server.close(()=>{
//     process.exit();
//   });
// })

// process.on('uncaughtException',(err)=>{
//   console.log(`Error: ${err.message}`);
//   console.log("Shuting down the server due to uncaught exception error");
//   server.close(()=>{
//     process.exit();
//   });
// })
const app = require('./app'); 
const http = require('http');
const path = require('path');
const connectionDB = require('./config/db');
const { setupWebSocket } = require('./ws/websocketManager');

connectionDB();

const srv = http.createServer(app); // <-- correct server instance
setupWebSocket(srv);                // <-- WebSocket attached

// Start the same server
const server = srv.listen(process.env.PORT, () => {
  console.log(`Server is running on port: ${process.env.PORT} in ${process.env.NODE_ENV}`);
});

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
