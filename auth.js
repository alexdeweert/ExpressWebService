// auth.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

//Router
router.use(bodyParser.json());

router.get('/', function(req,res) {
  res.send('GET Handler for auth.js');
});

router.post('/', function(req,res) {
  res.status(200).send(true);
});

module.exports = router;

// router.use(bodyParser.urlencoded({ extended: false }));

// var User = require('./user/User');
//
// var jwt = require('jsonwebtoken');
// var bcrypt = require('bcryptjs');
// var config = require('./config');
//
// //REGISTER
// router.post('/register', function(req, res) {
//
//   var hashedPassword = bcrypt.hashSync(req.body.password, 8);
//
//   User.create({
//     name : req.body.name,
//     email : req.body.email,
//     password : hashedPassword
//   },
//   function (err, user) {
//     if (err) return res.status(500).send("There was a problem registering the user.")
//     // create a token
//     var token = jwt.sign({ id: user._id }, config.secret, {
//       expiresIn: 86400 // expires in 24 hours
//     });
//     res.status(200).send({ auth: true, token: token });
//   });
// });
//
// module.exports = router;
