const express = require('express')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg')

//Use for heroku server testing
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

//ERGO DB
  // connectionString:
  // "Server=ec2-54-227-244-122.compute-1.amazonaws.com;"
  // "Port=5432; "
  // "User Id=eznftnmphcaegy; "
  // "Password=937bace5aa512a1570570939929aec644900a251ccd81a7544dc0a9ed3996383; "
  // "Database=dajaaj78bg1ub9; "
  // "TrustServerCertificate=true; "
  // "SSL Mode=Prefer;";

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

const app = express()
app.get('/getusers', async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM test_table');
    await res.send( result );
    await client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
