const express = require('express');
const app = express();
const db = require('./db.js');
const secure = require('express-force-https');

if (process.env.NODE_ENV !== "development") {
  console.log('using https!');
  app.use(secure);
}

app.use(express.json())

app.use('/assets', express.static('public'));

app.get('/',function(req,res) {
  res.sendFile(__dirname + '/main.html');
});

app.post('/subscribe', function(req,res){
  db.collection('emails').add({
    email: req.body.email
  }).then(ref => {
    console.log('Added Email with ID: ', ref.id);
    res.send('Thank you, we will be it touch!');
  }).catch(e => {
    console.log('Error writing Email',e)
    res.status(500).send('There was an error, Please try again later');
  });
});

const server = app.listen(8080, () => {
  console.log("Landing Page Runing!!");
});
