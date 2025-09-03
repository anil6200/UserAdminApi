const mongoose=require('mongoose');

const AdminSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        default:'admin'
    },
    tokenVersion: {
        type: Number,
        default: 1
    }
},{timestamps:true});

module.exports=mongoose.model('Admin',AdminSchema);