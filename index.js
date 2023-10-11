const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = express();
const port = 8000;

const secretKey = 'MySecret#321';
app.use(express.json());

const generateJwt = (input) =>{
  const generatedJwt = jwt.sign({input}, secretKey, {expiresIn:'1h'});
  return generatedJwt;
}

const authenticateJwt = (req,res,next) =>{
  console.log("entered in jwtauthentication");
  const authHeader = req.headers.authorization;
  console.log("authHeader: " + authHeader);
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      console.log("Token from jwtAuthentication",token);
      jwt.verify(token,secretKey,(err,user) =>{
        if (err) {
          return res.status(403);
        }
        req.user = user;
        next();
      });

    }
    else {
      return res.status(401);
    }
};


//define Schema
const adminSchema = mongoose.Schema({
  username: {type:String, required:true},
  password: {type:String, required:true}
});

const courseSchema = mongoose.Schema({
  title: {type:String},
  description: {type:String},
  price: {type:Number},
  imageLink: {type:String},
  published: {type:Boolean}
});

//define models
const Admin = mongoose.model('Admin',adminSchema);
const Course = mongoose.model('Course',courseSchema);

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

// //POST /admin/courses Create new courses
 app.post('/admin/courses', authenticateJwt, async (req,res) => {
  const course = new Course(req.body);
  console.log("entered course:", course);
  await course.save();
  return res.json({message:"Course created successfully", CourseID: course.id}); 
});


//PUT /admin/courses/
//GET /admin/courses Description:


app.listen(port,() => {
  console.log('listening on port ' + port);
});