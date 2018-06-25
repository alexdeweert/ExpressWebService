/*delete.js
* Here we delete rows from a table based on a client request
*/
var express = require('express');
var deleterouter = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const { Pool } = require('pg');
var config = require('./config');
var VerifyToken = require('./VerifyToken');
deleterouter.use(bodyParser.urlencoded({ extended: false }));
deleterouter.use(bodyParser.json());

//Uncomment "ssl:false" for live testing
//For local testing use "heroku local -e .env.test"
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
  });

//Delete something from the devices table
deleterouter.delete('/delete_from_devices', VerifyToken, async function( req,res,next ) {
  try {
    console.log("Client attempting to delete from devices table...");
    console.log("name: "  + " " + req.query.device_name + " userId: " + req.userId  + " device_type: " + req.query.device_type);
    console.log(req.query.device_name);
    console.log(req.query.device_type);
    const client = await pool.connect();
    const text = 'delete from devices where device_name=$1 and user_id=$2 and device_type=$3';
    const values = [req.query.device_name, req.userId, req.query.device_type];
    await client.query(text, values, (err, queryResult) => {
      if (err) {
        console.log(err.stack);
        res.status(500).send("There was an internal server problem attempting to DELETE from device table");
      }
      else {
        console.log("Client successfully deleted from device table");
        res.sendStatus(202);
      }
    });
    await client.release();
  }
  catch (err) {
    console.log("Error in deleterouter trying to update user weight and height");
    console.error(err);
    res.sendStatus(500);
  }
});

//Delete From Scheduler
deleterouter.delete('/delete_from_scheduler', VerifyToken, async function( req,res,next ) {
    try {
      console.log("Client attempting to delete from Schedule...");
      const client = await pool.connect();
      //const text = 'delete from scheduler where id = $1';
      const text = 'delete from scheduler where id = $1';
      const values = [req.query.id];
      await client.query(text, values, (err, queryResult) => {
        if (err) {
          console.log(err.stack);
          res.status(500).send("There was an internal server problem attempting to DELETE from Schedule");
        }
        else {
          console.log("Client successfully deleted from scheduler");
          res.sendStatus(202);
        }
      });
      await client.release();
    }
    catch (err) {
      console.log("Error in deleterouter trying to delete from scheduler");
      console.error(err);
      res.sendStatus(500);
    }
  });

module.exports = deleterouter;
