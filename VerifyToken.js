var jwt = require('jsonwebtoken');
var config = require('./config');

function verifyToken(req, res, next)
{
  console.log("Something called VerifyToken");
  var token = req.headers['x-access-token'];
  if(!token) {
    return res.status(403).send({auth:false, message:'No token provided.'});
  }

  jwt.verify(token, process.env.JSON_WEB_TOKEN, function(err, decoded) {
    if( err ) {
      if( err.name == 'TokenExpiredError' ) {
        console.log("Client attempted to access resources with an EXPIRED TOKEN: " + err);
        return res.status(401).send({auth:false, message:'Unauthorized token EXPIRED', 'json-web-token-status':'expired'});
      }
      else {
        console.log(err);
        return res.status(500).send({auth:false, message:'Failed to authenticate token'});
      }
    }
    console.log("The TOKEN sent by the user expires at UNIX time: " + decoded.exp);

    //TODO Check to make sure that the decoded ID actually exists in the Database
    //if it does not, send an error.

    req.userId = decoded.id;
    next();
  })
}

module.exports = verifyToken;
