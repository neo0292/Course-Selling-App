const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = express();
const port = 8000;

const secretKey = 'MySecret#321';
app.use(express.json());

function generateJwt (input) {
  const generatedJwt = jwt.sign({input}, secretKey, {expiresIn:'1h'});
  return generatedJwt;
}

//define Schema
const adminSchema = mongoose.Schema({
  username: {type:String, required:true},
  password: {type:String, required:true}
});

//define models
const Admin = mongoose.model('Admin',adminSchema);

// connect to Mongodb
mongoose.connect('mongodb+srv://nodejsUser:nodejsUser1@cluster0.as6c2vp.mongodb.net/nodejs');

// handle Admin routes
app.post('/admin/signup', async (req, res) => {
const {username, password} = req.body;
const admin = await Admin.findOne({username});
  if (admin){
    return res.status(404).json({message:"Admin already exists"});
  }
  else{
    const newAdmin = new Admin({username, password});
    await newAdmin.save();
    const token = generateJwt(username);
    res.status(200).json({message:"Admin successfully CREATED", token: token});

  }
});

app.post('/admin/login', async (req, res) => {
  const {username, password} = req.headers;
  console.log("i am in login route");
  console.log("admin login", username, password);
  const admin = await Admin.findOne({username, password});
  if (admin){
    const token = generateJwt(username);
    return res.json({message:"Admin logged in successfully", Token: token});
  } 
  else {
    return res.status(404).json({message:"Incorrect username or password"});
  }
});


app.listen(port,() => {
  console.log('listening on port ' + port);
});