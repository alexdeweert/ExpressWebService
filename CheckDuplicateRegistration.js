const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  //ssl: true
  ssl: process.env.REQUIRE_SSL
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

async function checkDuplicateRegistration(req, res, next)
{
  console.log("Something called checkDuplicateRegistration");
  const client = await pool.connect();
  const text = 'select * from "user" where email = $1 limit 1';
  const values = [req.body.email];
  console.log("checking for duplicate registration. The email to be checked is: " + req.body.email);
  await client.query(text, values, (err, queryResult) => {
    if (err) {
      console.log(err.stack);
      return res.status(500).send("There was a problem attempting to check for DUPLICATE REGISTRATION");
    }
    else {
      //If there was a result then someone is trying to conduct a duplicate registration
      if( queryResult.rows[0] ) {
        console.log( "Client attempted a DUPLICATE REGISTRATION with an email that already exists in the database: " + queryResult.rows[0].email );
        return res.status(400).send({auth: false, token: null});
      }
    }
    next();
  });
}

module.exports = checkDuplicateRegistration;
