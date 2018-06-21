// post.js
var express = require('express');
//var router = express.Router();
var postrouter = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const { Pool } = require('pg');
var config = require('./config');
var CheckDuplicateRegistration = require('./CheckDuplicateRegistration');
var VerifyToken = require('./VerifyToken');
postrouter.use(bodyParser.urlencoded({ extended: false }));
postrouter.use(bodyParser.json());
const tokenExpirySeconds = 7776000;//90 days

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

//AddScheduler "Schedule.xaml.cs"
postrouter.post('/add_scheduler', VerifyToken, async function( req,res,next ) {
  try {
    const client = await pool.connect();
    const text = 'insert into scheduler(id, sched_name, sched_start, sched_end, sched_date, sched_start_ind, sched_end_ind, user_id, preset_1, preset_2, preset_3, device_id) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)';
    const values = [req.body.id,req.body.sched_name,req.body.sched_start,req.body.sched_end,req.body.sched_date,req.body.sched_start_ind, req.body.sched_end_ind, req.body.user_id, req.body.preset_1, req.body.preset_2, req.body.preset_3, req.body.device_id];

    console.log("Client attempting to insert a device into the database: " + text + " " + req.body.id + " " + req.body.sched_name + " " + req.body.sched_start + " "
    + req.body.sched_end + " " + req.body.sched_date+ " " +req.body.sched_start_ind+ " " +req.body.sched_end_ind+ " " +req.body.user_id + " "
    + req.body.preset_1+ " " +req.body.preset_2 + " " + req.body.preset_3 + " " + req.body.device_id);

    await client.query(text, values, (err, queryResult) => {
      if (err) {
        console.log(err.stack);
        res.status(500).send("There was a problem with client attempting to insert into SCHEDULER");
      }
      else {
        console.log("Client successfully inserted into SCHEDULER into the database");
        res.sendStatus(201);
      }
      //next();
    });
    await client.release();
  }
  catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

//AddDevice "Connect.xaml.cs"
postrouter.post('/add_device', VerifyToken, async function( req,res,next ) {
  try {
    const client = await pool.connect();
    const text = 'insert into devices values($1, $2, $3, $4)';
    const values = [req.body.device_name,req.body.user_id,req.body.device_id,req.body.device_type];
    console.log("Client attempting to insert a device into the database: " + text + req.body.device_name + " " + req.body.user_id + " " + req.body.device_id + " " + req.body.device_type);
    await client.query(text, values, (err, queryResult) => {
      if (err) {
        console.log(err.stack);
        res.status(500).send("There was a problem with client attempting to insert a DEVICE");
      }
      else {
        console.log("Client successfully inserted a device into the database");
        res.sendStatus(201);
      }
      //next();
    });
    await client.release();
  }
  catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

//TODO make this work with "user" table not users
//POST Login
postrouter.post('/login', async function( req, res ) {
  try
  {
    console.log("Attempting to select * from users where email = " + req.body.email);
    console.log("req.body.password: " + req.body.password);
    const client = await pool.connect();
    //var user = await client.query('select * from users where email = $1 limit 1',[req.body.email]);

    const text = 'select * from users where email = $1 limit 1';
    const values = [req.body.email];
    await client.query(text, values, (err, queryResult) => {
      if (err) {
        console.log(err.stack)
      } else {
        console.log("Client login attempt resulted in a found account with email: " + req.body.email);
        console.log("Comparing the existing password in DB (which is hashed) with provided password: " + req.body.password);
        var isPasswordValid = bcrypt.compareSync(req.body.password, queryResult.rows[0].password);
        if( !isPasswordValid ) {
          console.log("Client provided an INVALID password");
          return res.status(401).send({auth: false, token: null, message: "Invalid password provided"});
        }
        else {
          console.log("Client provided a valid password");
          var jwtoken = jwt.sign({id:queryResult.rows[0].id}, config.secret, {expiresIn:tokenExpirySeconds});
          console.log("Sending 200 User was found with email: " + req.body.email + " during client LOGIN ATTEMPT");
          res.status(200).send({auth: true, token: jwtoken});
        }
      }
    });
  }
  catch(err)
  {
    console.log("Sending 500 error: problem finding the user during client LOGIN ATTEMPT");
    console.error(err);
    return res.status(500).send("There was a problem finding the user during client LOGIN ATTEMPT");
  }
});

//TODO make this work with "user" table not users
//POST: Register a user. Creates a new user entry in the database
//encrypts the users password, and sends the user a JSON Web Token
postrouter.post('/register', CheckDuplicateRegistration, async function( req,res,next ) {

  var hashedPassword = bcrypt.hashSync(req.body.password_hash, 8);
  console.log("A client is attempting to register with: ");
  console.log("Name: " + req.body.username);
  console.log("Email: " + req.body.email);
  console.log("Password: " + req.body.password_hash);
  console.log("...hashed the password: " + hashedPassword);

  //Create (add) the user
  try {
    //***
    var jwtoken = null;
    var userid = null;
    const client = await pool.connect()
    //Insert user into the database (will always insert)
    //TODO Insert if user does not exist and they are REGISTERING //add username, email, password_hash, about_me, last_seen, height, weight, dob, status
    await client.query('insert into "user" (id, username, email, password_hash, about_me, last_seen, height, weight, dob, status) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',['nextval(\'user_id_seq\')',req.body.username, req.body.email, req.body.password_hash, req.body.about_me, req.body.last_seen, req.body.height, req.body.weight, req.body.dob, req.body.status]);
    console.log("Inserted a user into the DB...");

    //IF we're registering the user we must generate a JSON WEB TOKEN (jwt)
    //so we get the users auto gen'd ID from the database, and use it to seed
    //the jwt.sign method
    var uid = await client.query('select id from "user" where email = $1',[req.body.email]);

    console.log("Got auto-generated user ID from the database to use at JWT payload (for encryption): " + uid.rows[0].id);
    jwtoken = jwt.sign( {id: uid.rows[0].id}, config.secret, {
      expiresIn: tokenExpirySeconds // expires in 90 days
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
