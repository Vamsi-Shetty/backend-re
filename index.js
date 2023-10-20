const express = require("express");
const bcryptjs = require('bcryptjs');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
require("dotenv").config();


const { connection } = require("./config/db");
const {userModel} = require("./models/users.model");
const {blogModel} = require("./models/blogs.model");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("home")
});

app.post("/signup", async (req, res) => {
    const {email, password} = req.body;
    bcrypt.hash(password, 3, async function(err, hash) {
        if(err) {
            console.log(err)
        }
        else {
            await userModel.create({email, password: hash});
            res.send({message:"user created successfully"});
        }
            
    });
})

app.post("/login", (req, res) => {
    const {email, password} = req.body;
    const isReg = userModel.findOne({email});
    const hash = isReg.password;
    if(isReg) {
        bcrypt.compare(password, hash, function(err, result) {
            if(result) {
                const token = jwt.sign({ userID: userModel._ID }, process.env.secret_key);
                return res.send({token: token, message:"login successful"});
            }
            // else if(err) {
                res.send({message:"wrogn password"});
            
        });
    }
})

app.get("/blogs", async (req, res) => {
    const {title, category, author} = req.body;
    const filter = {title, category, author}
    const blogData = await blogModel.find(filter);
    res.send({"blogs":blogData});
})

app.post("/blogs/create", async (req, res) => {
    const {title, category, author, content} = req.body;
    await blogModel.create({title, category, author, content});
    res.send({message:"blog created"});
})

app.patch("/blogs/:ID", async (req, res) => {
    const ID = req.params.ID;
    const update = req.body;
    await blogModel.findByIdAndUpdate(ID, update);
    res.send({message:"blog updated"});
})

app.delete("/blogs/:ID", async (req, res) => {
    const ID = req.params.ID;
    await blogModel.findByIdAndDelete(ID);
    res.send({message:"blog deleted"});
})


const PORT = process.env.PORT;

app.listen(PORT, async () => {
    try {
         await connection;
        console.log("COnnected to DB");
    } catch (error) {
        console.log("Error connecting to DB");
        console.log(error);
    }
    console.log(`listening on port ${PORT}`);
})