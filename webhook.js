//based on this article https://tutorials.botsfloor.com/creating-a-simple-facebook-messenger-ai-bot-with-api-ai-in-node-js-50ae2fa5c80d

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const apiaiApp = require('apiai')("d626859e22044ffeb13dd74d098be462");

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

/*function sendMessage(event) {
  let sender = event.sender.id;
  let text = event.message.text;

  request({
    url: 'https://graph.facebook.com/v3.0/me/messages',
    qs: {access_token: "EAAD1PeXZBkLcBALeB3ilLVNuICDmcXvIUfv5L52V7ekNAZBz3bsZCZCfpWhsWRLL3LuHXiZAd8S7R5neRlLqM4s0qOxeYVFgiiQ8WHytWaPwwMg0IV64tU2fyZBoKbrWX9Mw37X9NZCdClC0FQyl1oJgjhRhGd3pOlFU9N64aQEJwZDZD"},
    method: 'POST',
    json: {
      recipient: {id: sender},
      message: {text: text}
    }
  }, function (error, response) {
    if (error) {
        console.log('Error sending message: ', error);
    } else if (response.body.error) {
        console.log('Error: ', response.body.error);
    }
  });
}*/

function sendMessage(event) {
  let sender = event.sender.id;
  let text = event.message.text;

  let apiai = apiaiApp.textRequest(text, {
    sessionId: 'dunald_trump' // use any arbitrary id
  });

  apiai.on('response', (response) => {
  let aiText = response.result.fulfillment.speech;

    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token: "EAAD1PeXZBkLcBALeB3ilLVNuICDmcXvIUfv5L52V7ekNAZBz3bsZCZCfpWhsWRLL3LuHXiZAd8S7R5neRlLqM4s0qOxeYVFgiiQ8WHytWaPwwMg0IV64tU2fyZBoKbrWX9Mw37X9NZCdClC0FQyl1oJgjhRhGd3pOlFU9N64aQEJwZDZD"},
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



const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

