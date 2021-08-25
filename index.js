var express = require('express')
require('dotenv').config();
var app = express()


app.get('/twitter-auth', function (req, res) {
    res.send('hello from twitter auth callback')
});


app.listen(3000)
console.log(process.env.USER_ID);
console.log('listening on :3000');