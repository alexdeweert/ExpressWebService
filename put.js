/*put.js
* Here we accept updates and delete requests from the client
*/

// put.js
var express = require('express');
var putrouter = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const { Pool } = require('pg');
var config = require('./config');
var VerifyToken = require('./VerifyToken');
putrouter.use(bodyParser.urlencoded({ extended: false }));
putrouter.use(bodyParser.json());

//Uncomment "ssl:false" for live testing
//For local testing use "heroku local -e .env.test"
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
  });

//Update users weight and height
putrouter.put('/update_user_weight_height', VerifyToken, async function( req,res,next ) {
  try {
    console.log("Client attempting to update_user_weight_height...");
    const client = await pool.connect();
    //const text = 'delete from scheduler where id = $1';
    const text = 'update "user" set weight = $1, height = $2 where id = $3';
    const values = [req.body.weight, req.body.height, req.userId];
    await client.query(text, values, (err, queryResult) => {
      if (err) {
        console.log(err.stack);
        res.status(500).send("There was an internal server problem attempting to UPDATE user weight and height");
      }
      else {
        console.log("Client successfully updated user weight and height");
        res.sendStatus(202);
      }
    });
    await client.release();
  }
  catch (err) {
    console.log("Error in putrouter trying to update user weight and height");
    console.error(err);
    res.sendStatus(500);
  }
});

//Update Scheduler Presets
putrouter.put('/update_scheduler_presets', VerifyToken, async function( req,res,next ) {
    try {
      console.log("Client attempting to update Schedule presets...");
      const client = await pool.connect();
      const text = 'update scheduler set preset_1 = $1, preset_2 = $2, preset_3 = $3 where user_id = $4';
      //Note here, req.userId comes from VerifyToken.js decoding the user's sent jsonwebtoken
      const values = [req.body.preset_1,req.body.preset_2,req.body.preset_3,req.userId];
      await client.query(text, values, (err, queryResult) => {
        if (err) {
          console.log(err.stack);
          res.status(500).send("There was an internal server problem attempting to UPDATE Schedule PRESETS");
        }
        else {
          console.log("Client successfully updated scheduler presets");
          res.sendStatus(202);
        }
      });
      await client.release();
    }
    catch (err) {
      console.log("Error in putrouter trying to update scheduler presets");
      console.error(err);
      res.sendStatus(500);
    }
  });

module.exports = putrouter;
