var express = require('express'),
    get = require('./get'),
    post = require('./post'),
    app = express();

const PORT = process.env.PORT || 5000;
//Handles the mini apps from get.js or post.js
app.use('/', get);
app.use('/', post);
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
