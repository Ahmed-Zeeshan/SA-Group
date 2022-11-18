const mongoose = require('mongoose')


const transactionSchema = new mongoose.Schema({
    user:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    project:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
    },
    comments:{ 
        type:String,
        required:true
    },
    amount:{ 
        type:Number,
        default:0,
        required:true
    }
},{timestamps:true})


const transactionModel = mongoose.model('Transaction',transactionSchema)
module.exports = transactionModel