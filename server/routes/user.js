const express = require('express');
const {Course,User} = require ('../db');
const {generateJwt,authenticateJwt} = require('../middleware/auth');

const router = express.Router();

router.post('/signup', async(req, res)=>{
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


//POST /login Description: Authenticates a user. It requires the user to send username and password in the headers.
router.get('/login', async (req,res)=>{
  const {username,password} = req.headers;
  const user= await User.findOne({username,password});
  if (user) {
    token = generateJwt(username);
    res.status(200).json({message: "user logged in successfully", token:token});
    
  } else {
    res.status(404).json({message: "invalid username or password"});
  }
})
//GET /courses Description: Lists all the courses
router.get('/courses', authenticateJwt, async (req,res)=>{
  const courses = await Course.find({});
  return res.status(200).json({courses: courses});
});

//POST /courses/:courseId Description: Purchases a course bu user.
router.post('/courses/:courseId', authenticateJwt, async (req,res)=>{
  const course = await Course.findById(req.params.courseId);
  console.log("You are trying to purchase course:",course);
  if (course) {
    console.log(" what is req.user:",req.user);
    console.log(" what is req.user.username:",{username:req.user.username});
    const user = await User.findOne({username:req.user.input});
        if (user) {
        user.purchasedCourses.push(course);
        await user.save();
        return res.status(200).json({message: 'Course purchased successfully', course: course});
      
        } else {
        return res.status(404).json({message: 'user not found'});
        }
    
  } else {
    return res.status(404).json({message: 'course not found'});
  }
});

//GET /purchasedCourses Description: Lists all the courses purchased by the user.
router.get('/purchasedCourses', authenticateJwt, async (req, res) => {
  console.log("entered in purchased courses");
  const user = await User.findOne({username: req.user.input}).populate('purchasedCourses');
  if(user){
    return res.json({purchasedCourses: user.purchasedCourses|| []});
  }
  else{
    return res.status(403).json({message: 'user not found'});
  }
});

module.exports = router ;