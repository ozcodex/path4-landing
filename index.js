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

function validate(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

app.post('/subscribe', function(req,res){
  let email = String(req.body.email).toLowerCase();
  if(validate(email)){
    db.collection('emails').add({
      email: req.body.email
    }).then(ref => {
      console.log('Added Email with ID: ', ref.id);
      res.send('Thank you, we will be it touch!');
    }).catch(e => {
      console.log('Error writing Email',e)
      res.status(500).send('There was an error, Please try again later');
    });
  }else{
      res.status(400).send('That is not a valid email, please try again');
  }
});

const server = app.listen(8080, () => {
  console.log("Landing Page Runing!!");
});
