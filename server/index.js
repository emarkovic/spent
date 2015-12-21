var express = require('express');
var fs = require('fs');

var data = require('./data');

var app = express();

app.use(express.static(__dirname + '/../'));

app.get('/test', function (req, res, next) {
	res.json({
		hi: "hello"
	});
});

app.get('/data', function (req, res, next) {
	res.json(data);
});

app.listen(8000, function () {
	console.log('listening on port 8000');
});