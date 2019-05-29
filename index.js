const express = require('express');
const app = express();

function requireHTTPS(req, res, next) {
  if (!req.secure !== 'https' && process.env.NODE_ENV !== "development") {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}

app.use(requireHTTPS);

app.use('/assets', express.static('public'));

app.get('/',function(req,res) {
  res.sendFile(__dirname + '/main.html');
});

const server = app.listen(8080, () => {
  console.log("Landing Page Runing!!");
});
