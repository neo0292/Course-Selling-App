const jwt = require('jsonwebtoken');  // for Authentication
const secretKey = 'MySecret#321';

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

module.exports = {
  generateJwt,
  authenticateJwt,
  secretKey
};