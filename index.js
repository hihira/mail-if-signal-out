var bcrypt = require('bcrypt');
var express = require('express');
var bodyParser = require('body-parser');

var mailSendTime = undefined;
var counter = process.env.DEFAULT_LIMIT_MIN * 60;

function resetCounter() {
  console.log("counter reset.");
  counter = process.env.DEFAULT_LIMIT_MIN * 60;
}

function sendMail() {
  var salt = bcrypt.genSaltSync(10);
  mailSendTime = (new Date).getTime() + '';
  var hash = bcrypt.hashSync(mailSendTime, salt);

  var sendgrid = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);
  sendgrid.send({
      to:       process.env.MAIL_TO,
      from:     process.env.MAIL_FROM,
      subject:  process.env.MAIL_SUBJECT,
      text:     'visit /reset?key=' + hash
  }, function(err, json) {
      if (err) { return console.error(err); }
        console.log(json);
  });

  console.log("sended mail. key=" + hash);

  resetCounter();
  clearInterval(interval);
}

var countDown = function() {
  console.log(counter);

  if (counter <= 0) {
    sendMail();
  }

  counter--;
}
var interval = setInterval(countDown, 1000);

var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/heartbeat', function(request, response) {
  if (request.param("access-token") !== process.env.ACCESS_TOKEN) {
    console.log("non auth.");
    response.status(401).end();
    return;
  }

  response.send('counter: ' + counter + "\nreset.");

  resetCounter();
});

app.get('/reset', function(request, response) {

  // TODO getパラメータ'key'のバリデーション

  if (!bcrypt.compareSync(mailSendTime, request.param("key"))) {
    console.log("miss key.");
    response.status(401).end();
    return;
  }

  resetCounter();
  interval = setInterval(countDown, 1000);

  response.send('reseted');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
