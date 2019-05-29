const express = require('express');
const app = express();
const db = require('./db.js');
const secure = require('express-force-https');

if (process.env.NODE_ENV !== "development") {
  console.log('using https!');
  app.use(secure);
}

app.use('/assets', express.static('public'));

app.get('/',function(req,res) {
  res.sendFile(__dirname + '/main.html');
});

app.post('/subscribe', function(req,res){
  console.log('i recived a post',req.body);
  res.send('ok');
});

const server = app.listen(8080, () => {
  console.log("Landing Page Runing!!");
});
