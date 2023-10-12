const express = require('express');  // for server
const mongoose = require('mongoose'); // for Mongodb 
const jwt = require('jsonwebtoken');  // for Authentication
const app = express();
const port = 8000;

const secretKey = 'MySecret#321';
app.use(express.json());  // middleware for obtainig input from user in req.body format



//function to generate token
const generateJwt = (input) =>{       
  const generatedJwt = jwt.sign({input}, secretKey, {expiresIn:'1h'});
  return generatedJwt;
}

//middleware to verify routes using token
const authenticateJwt = (req,res,next) =>{
  console.log("entered in jwtauthentication");
  const authHeader = req.headers.authorization;
  console.log("authHeader: " + authHeader);
    if (authHeader) {
      const token = authHeader.split(' ')[1]; // split authHeader into starting from space in it & take 1st //string  after space
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


//define Schema for MONGODB (DOCUMENTS STRUCTURE)
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

const userSchema = mongoose.Schema({
  username:{type:String, required:true},
  password:{type:String, required: true}
});

//define models for schemas (collection/Table creation)
const Admin = mongoose.model('Admin',adminSchema);
const Course = mongoose.model('Course',courseSchema);
const User = mongoose.model('User', userSchema);

// connect to Mongodb with nodejs name as  database
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


//PUT /admin/courses/ Update old courses
app.put('/admin/courses/:courseId', authenticateJwt, async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.courseId,req.body, {new:true});
  if (course){
    return res.status(200).json({message:'Course updated successfully',course: course});
  }
  else{
    res.status(404).json({message:"Course not found"});
  }
});

//GET /admin/courses return all courses in course collection
app.get('/admin/courses', authenticateJwt, async(req, res)=>{
const courses = await Course.find({});    // get all courses from course collection
if (courses){
  return res.status(200).json({message:"All courses from Course collection:",courses});
}
else{
  return res.jason({message: "no courses found"});
}});



app.post('/users/signup', async(req, res)=>{
  const {username,password} = req.body;
  const user= await User.findOne({username});
  if (user) {
    return res.status(403).json({message: "User already exists with username:", username});
  } else {
    const newUser= new User({username,password});
    await newUser.save();
    const token = generateJwt(username);
    return res.status(200).json({message: "User created successfully", token: token});
  } 
});


//POST /users/login Description: Authenticates a user. It requires the user to send username and password in the headers.
app.get('/users/login', async (req,res)=>{
  const {username,password} = req.headers;
  const user= await User.findOne({username,password});
  if (user) {
    token = generateJwt(username);
    res.status(200).json({message: "user logged in successfully", token:token});
    
  } else {
    res.status(404).json({message: "invalid username or password"});
  }
})
//GET /users/courses Description: Lists all the courses
app.get('/users/courses', authenticateJwt, async (req,res)=>{
  const courses = await Course.find({});
  return res.status(200).json({courses: courses});
});
//POST /users/courses/:courseId Description: Purchases a course.
//GET /users/purchasedCourses Description: Lists all the courses purchased by the user.





app.listen(port,() => {
  console.log('listening on port ' + port);
});