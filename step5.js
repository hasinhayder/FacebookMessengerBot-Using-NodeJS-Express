const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const apiaiApp = require('apiai')("dialogflow_token");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/",(req,res)=>{
	res.status(200).send("Hello. I am your assistant Donald Trump. How can I serve you?")
});

app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'donald_trump') {
    res.status(200).send(req.query['hub.challenge']);
  } else {
    res.status(403).end();
  }
});

app.post('/webhook', (req, res) => {
  console.log(req.body);
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message && event.message.text) {
          sendMessage(event);
        }
      });
    });
    res.status(200).end();
  }
});

function sendMessage(event) {
  let sender = event.sender.id;
  let text = event.message.text;

  let apiai = apiaiApp.textRequest(text, {
    sessionId: 'dunald_trump' // use any arbitrary id
  });

  apiai.on('response', (response) => {
  let aiText = response.result.fulfillment.speech;

    request({
      url: 'https://graph.facebook.com/v3.0/me/messages',
      qs: {access_token: "PAGE_TOKEN"},
      method: 'POST',
      json: {
        recipient: {id: sender},
        message: {text: aiText}
      }
    }, (error, response) => {
      if (error) {
          console.log('Error sending message: ', error);
      } else if (response.body.error) {
          console.log('Error: ', response.body.error);
      }
    });
 });

  apiai.on('error', (error) => {
    console.log(error);
  });

  apiai.end();
}



const server = app.listen(PORT, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});