const mongoose = require('mongoose'); // for Mongodb 

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
  password:{type:String, required: true},
  purchasedCourses: [{type:mongoose.Schema.Types.ObjectId, ref:'Course'}]
});

//define models for schemas (collection/Table creation)
const Admin = mongoose.model('Admin',adminSchema);
const Course = mongoose.model('Course',courseSchema);
const User = mongoose.model('User', userSchema);

module.exports= {Admin, Course, User}