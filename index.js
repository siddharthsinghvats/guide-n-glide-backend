const express = require('express');
require('./db/config')
const User = require('./db/UserSchema');
const Post = require('./db/Posts');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const dotenv = require("dotenv");
dotenv.config();


var ObjectId = require('mongodb').ObjectId;

const app = express();


app.use(express.json());
app.use(cors());

app.post('/register', async (req, res) => {
    let result = await User.findOne({ email: req.body.email });
    if (result) {
        res.status(400);
        res.send({ message: "Email already exists" });
        return;
    }
    let userExist = await User.findOne({ username: req.body.username });
    if (userExist) {
        res.status(400);
        res.send({ message: "Username already exists" });
        return;
    }
    var savedInfo;
    bcrypt.hash(req.body.password, 10, async function (err, hash) {
        if (!err) {
            savedInfo = req.body;
            savedInfo.password = hash;
            // console.log(savedInfo);
            const data = new User(savedInfo);
            let result = await data.save();
            result = result.toObject();
            delete result.password;
            res.send(result);
        }
        else
            alert('Error Occurred');
    });

})

app.post('/signin', async (req, res) => {
    let userExist = await User.findOne({ username: req.body.username });
    if (!userExist) {
        res.status(400);
        res.send({ message: "No such user!" });
        return;
    }

    bcrypt.compare(req.body.password, userExist.password, function (err, result) {
        if (err) {
            res.status(404);
            res.send({ message: 'Some error occurred!' });
        } else {
            if (result) {
                let username = userExist.username;
                let name = userExist.name;
                let profile_img = userExist.profile_img;
                res.send({ username, name,profile_img });
            } else {
                res.status(404);
                res.send({ message: 'Incorrect username or password!' });
            }
        }
    });

})

app.get('/posts', async (req, res) => {
    res.send(await Post.find());
})

app.get('/posts/:id', async (req, res) => {
    const result = (await Post.find({ _id: ObjectId(req.params.id) }));
    if (result) {
        res.send(result);
    } else {
        res.status(404);
        res.send({ message: "No posts found" });
    }
})


app.post('/create', async (req, res) => {
    const data = new Post(req.body);
    let result = await data.save();
    res.send(result);
})

app.get('/profile/:username', async (req, res) => {
    let result = await User.findOne({ username: req.params.username });
    if (result) {
        result = result.toObject();
        delete result.password;
        res.send(result);
    } else {
        res.status(404);
        res.send({ message: "No such user" });
    }

})

app.put('/create/:id', async (req,res)=>{
    const result = await User.findOne({username:req.body.username});
    const cur = result.posts;
    cur.push(req.params.id);

    const upd  = await User.updateOne({username:req.body.username},{
        $set:{posts:cur}
    })
    res.send(upd);
})

app.get("/user_posts/:username",async (req,res)=>{
    const result = await Post.find({author_username:req.params.username});
    if(result){
        res.send(result);
    }else{
        res.status(404);
        res.send({message:'Error'})
    }
})

app.delete('/profile/:id',async (req,res)=>{
    const result = await Post.deleteOne({_id:req.params.id});
    res.send(result);
})
app.listen(process.env.PORT);