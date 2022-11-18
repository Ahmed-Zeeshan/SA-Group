const mongoose = require('mongoose');

function connectDB() {
    mongoose.connect(process.env.MONGO_URI_CLOUD).then(()=>{
        console.log('connected to db')
    }).catch((err)=>{
        console.log(err.message)
    });
}







module.exports = connectDB;
