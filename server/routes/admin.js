const mongoose = require('mongoose');
const express = require('express');
const {Admin,Course} = require ('../db');
const {generateJwt,authenticateJwt} = require('../middleware/auth');

const router = express.Router();

// handle Admin routes
router.post('/signup', async (req, res) => {
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
  
  router.post('/login', async (req, res) => {
    console.log(req.body);
    const {username, password} = req.body;
    console.log("i am in login route");
    console.log("admin login", username, password);
    const admin = await Admin.findOne({username, password});
    if (admin){
      const token = generateJwt(username);
      return res.json({message:"Admin logged in successfully", token: token});
    } 
    else {
      return res.status(404).json({message:"Incorrect username or password"});
    }
  });
  
  // //POST /admin/courses Create new courses
   router.post('/courses', authenticateJwt, async (req,res) => {
   console.log("req from admin route:",req);
    const course = new Course(req.body);
    console.log("entered course:", course);
    await course.save();
    return res.json({message:"Course created successfully", CourseID: course.id}); 
  });
  
  
  //PUT /admin/courses/ Update old courses
  router.put('/courses/:courseId', authenticateJwt, async (req, res) => {
    console.log("req reached in update course server route");
    const course = await Course.findByIdAndUpdate(req.params.courseId,req.body, {new:true});
    if (course){
      return res.status(200).json({message:'Course updated successfully',course: course});
    }
    else{
      res.status(404).json({message:"Course not found"});
    }
  });
  
  //GET /admin/courses return all courses in course collection
  router.get('/courses', authenticateJwt, async(req, res)=>{
   
  console.log('entered in get courses route');
  
  const courses = await Course.find({}); 
  console.log('returned courses',courses)   // get all courses from course collection
  if (courses){
    return res.status(200).json({message:"All courses from Course collection:",courses});
  }
  else{
    return res.json({message: "no courses found"});
  }});

 //get specific course with courseId
 router.get('/courses/:courseId', authenticateJwt, async (req, res) => {
  console.log("req reached in server route");
  const course = await Course.findById(req.params.courseId);
  console.log('course id from server:',req.params.courseId);
  if (course){
    return res.status(200).json({message:'Course found:',course: course});
  }
  else{
    res.status(404).json({message:"Course not found"});
  }
});

  
  module.exports = router ;