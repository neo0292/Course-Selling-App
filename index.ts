const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 8000;

app.use(express.json());

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
    res.status(200).json({message:"Admin successfully CREATED"});

  }
})

app.post('/admin/login', async (req, res) => {
  const {username, password} = req.headers;
  console.log("i am in login route");
  console.log("admin login", username, password);
  const admin = await Admin.findOne({username, password});
  if (admin){
    return res.json({message:"Admin logged in successfully"});
  } 
  else {
    return res.status(404).json({message:"Incorrect username or password"});
  }
});


app.listen(port,() => {
  console.log('listening on port ' + port);
});