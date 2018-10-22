var express = require('express');
var app = express();
var fs = require("fs");

app.get('/alerts', function (req, res) {
   fs.readFile( __dirname + "/" + "tma.alert.json", 'utf8', function (err, data) {
      console.log( data );
      res.end( data );
   });
})

app.get('/:id', function (req, res) {
    // First read existing users.
    fs.readFile( __dirname + "/" + "tma.alert.json", 'utf8', function (err, data) {
       var alerts = JSON.parse( data );
       var alert = alerts.find(function (alert) {
           id = alert.identifier;
           console.log('the Alert');
           console.log(alert);
           console.log('real id: ' + id );
           console.log('req id: ' + req.params.id );
           return id === req.params.id;
       });
       console.log( alert );
       res.end( JSON.stringify(alert));
    });
 })

var server = app.listen(8082, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})