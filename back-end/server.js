const app = require('./app');

const path = require('path');
const connectionDB = require('./config/db');


connectionDB();

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port: ${process.env.PORT} in ${process.env.NODE_ENV}`);
})

process.on('unhandledRejection',(err)=>{
  console.log(`Error: ${err.message}`);
  console.log("Shuting down the server due to unhandled rejection error");
  server.close(()=>{
    process.exit();
  });
})

process.on('uncaughtException',(err)=>{
  console.log(`Error: ${err.message}`);
  console.log("Shuting down the server due to uncaught exception error");
  server.close(()=>{
    process.exit();
  });
})

