const express = require('express')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg')
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});
const app = express()

app.get('/', (req, res) => res.send('HAHAHAH'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

app.get('/db', async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM test_table');
    console.log(result);
    res.render('/', result);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});
