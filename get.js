/*get.js
* Here we accept select statements from the client
*/

var express = require('express');
var getrouter = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const { Pool } = require('pg');
var config = require('./config');
var VerifyToken = require('./VerifyToken');
getrouter.use(bodyParser.urlencoded({ extended: false }));
getrouter.use(bodyParser.json());

//Uncomment "ssl:false" for live testing
//For local testing use "heroku local -e .env.test"
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
  });

//GET
getrouter.get('/', function(req,res) {
  res.send('GET Handler for get.js: does nothing for now (will eventually return data if the JSON Web Token is valid)');
});

//GET scheduler table
getrouter.get('/get_scheduler_table', VerifyToken, async function(req, res, next) {
  try {
    const client = await pool.connect()
    await client.query('select * from scheduler', (err, result) => {
      if(err) {
        console.log("500 Error; Database error");
        return res.status(500).send("500 Error; Database error");
      }
      if(!result) {
        console.log("Sending 404 error: No results from query");
        return res.status(404).send("Sending 404 error: No results from query");
      }
      else {
        console.log("Query successful, sending results to client");
        res.status(200).send(result);
      }
    });
    await client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

//GET users table
getrouter.get('/get_users_table', VerifyToken, async function(req, res, next) {
  try {
    const client = await pool.connect()
    await client.query('select * from "user"', (err, result) => {
      if(err) {
        console.log("500 Error; Database error");
        return res.status(500).send("500 Error; Database error");
      }
      if(!result) {
        console.log("Sending 404 error: No results from query");
        return res.status(404).send("Sending 404 error: No results from query");
      }
      else {
        console.log("Query successful, sending results to client");
        res.status(200).send(result);
      }
    });
    await client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

//GET devices table
getrouter.get('/get_devices_table', VerifyToken, async function(req, res, next) {
  try {
    const client = await pool.connect()
    await client.query('select * from devices', (err, result) => {
      if(err) {
        console.log("500 Error; Database error");
        return res.status(500).send("500 Error; Database error");
      }
      if(!result) {
        console.log("Sending 404 error: No results from query");
        return res.status(404).send("Sending 404 error: No results from query");
      }
      else {
        console.log("Query successful, sending results to client");
        res.status(200).send(result);
      }
    });
    await client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

module.exports = getrouter;


// //GET's the user ID associated with a user token
// /*TODO THIS IS A TEST ONLY it should not be present in the final code!!!
// Because this returns ALL user information which of course is dangerous*/
// getrouter.get('/me', VerifyToken, async function(req, res, next) {
//
//   try {
//     const client = await pool.connect()
//     await client.query('select * from "user" where id = $1',[req.userId], (err,user) => {
//         console.log("Attempting to select * from \"user\" where id = something");
//         console.log("req.userId: " + req.userId);
//         //There was some internal server error (ie a database error)
//         if(err) {
//           console.log("Sending 500 error: problem finding the user");
//           console.error(err);
//           return res.status(500).send("There was a problem finding the user");
//         }
//         //There was no user found with that id
//         if( !user )
//         {
//           console.log("Sending 404 error: No user found");
//           return res.status(404).send("No user found");
//         }
//         //User was found
//         else {
//           console.log("Seding 200 User was found with uid: " + req.userId);
//           res.status(200).send(user);
//         }
//     });
//     //Finished with the query so release the client
//     await client.release();
//   }
//   catch (err) {
//     //There was some internal server error (ie a database error)
//     console.error(err);
//     res.sendStatus(500);
//   }
// });
