const mongoose = require('mongoose');

const postSchema= new mongoose.Schema({
    title:String,
    description:String,
    keywords:String,
    category:String,
    image:{
        data: Buffer,
        contentType:String
    }
});

const postModel = new mongoose.model("posts",postSchema);
module.exports = postModel;