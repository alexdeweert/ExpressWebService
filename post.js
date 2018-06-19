// post.js
var express = require('express');
//var router = express.Router();
var postrouter = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const { Pool } = require('pg');
var config = require('./config');
var VerifyToken = require('./VerifyToken');
postrouter.use(bodyParser.urlencoded({ extended: false }));
postrouter.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
  });

// //Use for localhost testing
// const pool = new Pool({
//   host: 'localhost',
//   port: '5432',
//   user: 'postgres',
//   database: 'postgres',
//   password: 'postgres',
//   ssl: false
// });

//POST: Register a user. Creates a new user entry in the database
//encrypts the users password, and sends the user a JSON Web Token
postrouter.post('/register', async function(req,res) {

  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  console.log("A client is attempting to register with: ")
  console.log("Name: " + req.body.name);
  console.log("Email: " + req.body.email);
  console.log("Password: " + req.body.password);
  console.log("...hashed the password: " + hashedPassword);

  //Create (add) the user
  try {
    //***
    var jwtoken = null;
    var userid = null;
    const client = await pool.connect()
    //Insert user into the database (will always insert)
    //TODO Insert if user does not exist and they are REGISTERING
    await client.query('insert into users values(99, $1, $2, 1, 1, \'1983-01-01\',$3, $3, 1200, 1200, \'2016-01-01\', 99, 99)',[req.body.email,hashedPassword,req.body.name]);
    console.log("Inserted a user into the DB...");

    //IF we're registering the user we must generate a JSON WEB TOKEN (jwt)
    //so we get the users auto gen'd ID from the database, and use it to seed
    //the jwt.sign method
    var uid = await client.query('select id from users where username = $2 and email = $1',[req.body.email,req.body.name]);

    console.log("Got auto-generated user ID from the database to use at JWT payload (for encryption): " + uid.rows[0].id);
    jwtoken = jwt.sign( {id: uid.rows[0].id}, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    console.log("Generated a JSON Web Token based on the users ID and a SECRET key: " + jwtoken);
    res.status(200).send({ auth: true, token: jwtoken });

    await client.release();
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = postrouter;
