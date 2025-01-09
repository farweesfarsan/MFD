const mongoose = require('mongoose');

const connectDatabase = ()=>{
    mongoose.connect(process.env.DB_LOCAL_URI,{
        ///to prevent default and old parser and topology ///

        useNewUrlParser:true,
        useUnifiedTopology:true

    }).then(con=>{
        console.log(`MongoDB connected successfully your host is : ${con.connection.host}`);
    })
}

module.exports = connectDatabase;