const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{ 
        type:String,
        required:true
    },
    email:{ 
        type:String,
        unique:true,
        required:true
    },
    contact:{ 
        type:String,
        unique:true,
        min:11,
        max:11,
        required:true
        
    },
    password:{ 
        type:String,
        required:true
    },
  

},{timestamps:true})

const userModel = mongoose.model('user',userSchema)
module.exports = userModel