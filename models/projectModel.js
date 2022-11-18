const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    name:{ 
        type:String,
        trim:true,
        unique:true,
        required:true
    }
},{timestamps:true})


const projectModel = mongoose.model('Project',projectSchema)
module.exports = projectModel