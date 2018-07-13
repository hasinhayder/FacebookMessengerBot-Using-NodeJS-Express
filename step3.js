const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const PORT = process.env.PORT || 5000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",(req,res)=>{
	res.status(200).send("Hello. Donald Trump Speaking. How Can You Serve Me?")
});

app.get('/webhook', (req, res) => {
    if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'donald_trump') {
      res.status(200).send(req.query['hub.challenge']);
    } else {
      res.status(403).end();
    }
});

app.listen(PORT, () => {
  console.log('Our BotApp is running on port %d in %s mode', server.address().port, app.settings.env);
});