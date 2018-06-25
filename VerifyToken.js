var jwt = require('jsonwebtoken');
var config = require('./config');
const { Pool } = require('pg');

//Uncomment "ssl:false" for live testing
//For local testing use "heroku local -e .env.test"
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
  });

function verifyToken(req, res, next)
{
  console.log("Something called VerifyToken...");
  var token = req.headers['x-access-token'];
  if(!token) {
    console.log("...However, the client did not provide a token - this is likely the result of trying to log in with an invalid password!!");
    return res.status(403).send({auth:false, message:'No token provided. Try logging in with the correct password.'});
  }

  jwt.verify(token, process.env.JSON_WEB_TOKEN, function(err, decoded) {
    if( err ) {
      if( err.name == 'TokenExpiredError' ) {
        console.log("Client attempted to access resources with an EXPIRED TOKEN: " + err);
        return res.status(401).send({auth:false, message:'Unauthorized token EXPIRED', 'json-web-token-status':'expired'});
      }
      else {
        console.log("Error within verifyToken...")
        console.log(err);
        return res.status(500).send({auth:false, message:'Failed to authenticate token'});
      }
    }
    console.log("The TOKEN sent by the user expires at UNIX time: " + decoded.exp);

    //TODO This is more of a note: Any function that calls this (this as in, VerifyToken)
    //in its chain of execution, ie "postrouter.post('/add_scheduler', VerifyToken, async function( req,res,next ) {..."
    //can then refer to the variable req.userId... which is the decoded userId provided by the client during any call
    //to a get or post request...

    //It might be helpful at some point to use that decoded TOKEN (which contains the user id) to see if that user
    //actually exists in the database, or to retrieve more information about the current user.
    req.userId = decoded.id;
    next();
  })
}

module.exports = verifyToken;
