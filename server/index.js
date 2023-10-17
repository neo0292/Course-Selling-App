const express = require('express');  // for server
const mongoose = require('mongoose'); // for Mongodb 
const cors = require('cors'); 
const app = express();
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');

const port = 8000;
app.use(cors());
app.use(express.json());  // middleware for obtainig input from user in req.body format
app.use('/admin',adminRouter); // middleware for handling admin routes
app.use('/user',userRouter); // middleware for handling user routes



// connect to Mongodb with nodejs name as  database
mongoose.connect('mongodb+srv://nodejsUser:nodejsUser1@cluster0.as6c2vp.mongodb.net/nodejs');

app.listen(port,() => {
  console.log('listening on port ' + port);
});