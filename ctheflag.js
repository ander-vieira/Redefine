var https = require('https');
var request = require('request');
var headers = {
  'User-Agent':       'Super Agent/0.0.1',
  'Content-Type':     'application/x-www-form-urlencoded',
  'Cookie': 'cookie'

}//'Referer' : 'http://natas5.natas.labs.overthewire.org/'
var options = {
  url: 'http://natas5:iX6IOfmpN7AYOQGPwtn3fXpbaJVJcHfq@natas5.natas.labs.overthewire.org/',
  method: 'GET',
  headers: headers,
}
  request(options, function (error, response, body) {
    console.log(response);
  });
