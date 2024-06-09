const mongoose = require('mongoose');

const userSchema= new mongoose.Schema({
    fullname:String,
    email:String,
    contact:String,
    password:String,
    role:String
});

const userModel = new mongoose.model("users",userSchema);
module.exports = userModel;