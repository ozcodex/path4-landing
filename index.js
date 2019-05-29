const express = require('express');
const app = express();

app.use('/assets', express.static('public'));

app.get('/',function(req,res) {
  res.sendFile(__dirname + '/main.html');
});

const server = app.listen(8080, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`Example app listening at http://${host}:${port}`);
});
