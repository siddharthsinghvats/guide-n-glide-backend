const mongoose = require('mongoose');

const post = new mongoose.Schema({
    title:String,
    author_username:String,
    author_name:String,
    header:String,
    author_image:String,
    likeCount:{
        type:Number,
        default:0
    },
    content:String,
    time:{
        type:String,
        default:new Date().toLocaleDateString()
    },
    image:{
        type:String,
        default:'https://cdn.pixabay.com/photo/2017/05/11/11/15/workplace-2303851__340.jpg'
    }
})

module.exports = mongoose.model('posts',post);