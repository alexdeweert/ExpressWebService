const express = require('express')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg')

//Use for heroku server testing
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
  });

//ERGO DB
  // connectionString:
  // "Server=ec2-54-227-244-122.compute-1.amazonaws.com;"
  // "Port=5432; "
  // "User Id=eznftnmphcaegy; "
  // "Password=937bace5aa512a1570570939929aec644900a251ccd81a7544dc0a9ed3996383; "
  // "Database=dajaaj78bg1ub9; "
  // "TrustServerCertificate=true; "
  // "SSL Mode=Prefer;";

//Use for localhost testing
// const pool = new Pool({
//   host: 'localhost',
//   port: '5432',
//   user: 'postgres',
//   database: 'postgres',
//   password: 'postgres',
//   ssl: false
// });

const app = express()
app.set( 'view engine', 'pug' );

app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
});

//GET Test Table
app.get('/get_test_table', async (req, res) => {
  try {



    const client = await pool.connect()
    const result = await client.query('SELECT * FROM test_table');
    console.log("Client queried TEST table and received: ");
    console.log(result.rows);
    await res.send( result.rows );
    await client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

//GET scheduler table
app.get('/get_scheduler_table', async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM scheduler');
    console.log("Client queried SCHEDULER table and received: ");
    console.log(result.rows);
    await res.send( result.rows );
    await client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

//GET users table
app.get('/get_users_table', async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT id, username FROM users');
    console.log("Client queried USERS table and received: ");
    console.log(result.rows);
    await res.send( result.rows );
    await client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

//GET devices table
app.get('/get_devices_table', async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM devices');
    console.log("Client queried DEVICES table and received: ");
    console.log(result.rows);
    await res.send( result.rows );
    await client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});


app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
