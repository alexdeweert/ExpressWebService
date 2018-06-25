var express = require('express'),
    get = require('./get'),
    post = require('./post'),
    put = require('./put'),
    delete_router = require('./delete'),
    app = express();

const PORT = process.env.PORT || 5000;

//Handles the mini apps from get.js or post.js
app.use('/', get);
app.use('/', post);
app.use('/', put);
app.use('/', delete_router);
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
