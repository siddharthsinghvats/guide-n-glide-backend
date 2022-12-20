const mongoose = require('mongoose');

const user = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    college:String,
    username:String,
    skills:String,
    profile_img:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2020/02/22/16/29/penguin-4871045__340.png"
    },
    posts:{
        type:Array,
        default:[]
    }
})

module.exports = mongoose.model('users',user);