var express = require('express');
var path = require('path');
var _ = require('lodash');
var app = express();
var fs = require("fs");


stringToArrayCoordinates = function (stringCoordinates) {
    const splitCoordinates = stringCoordinates.trim().split(' ');

    const polygon = splitCoordinates.map(splitCoordinate =>
        splitCoordinate.split(',').reverse().map(value => parseFloat(value)));

    const centroid = polygon[0];
    return { polygon, centroid };
  }

modifyAlert = function (alert){
    var modifedArea = stringToArrayCoordinates(_.get(alert, "info.area.polygon"));
    var modifiedAlert = {
        source: {
            name: _.get(alert, "info.senderName"),
            phone: '',
            email: _.get(alert, "sender"),
            website: _.get(alert, "info.web")
        },
        event: {
            code: '',
            name: _.get(alert, "info.event"),
            category: _.get(alert, "info.category"),
            description: _.get(alert, "info.category"),
            urgency: _.get(alert, "info.urgency"),
            severity: _.get(alert, "info.severity"),
            certainty: _.get(alert, "info.severity"),
            response: _.get(alert, "info.responseType")
          },
          message: {
            status: _.get(alert, "status"),
            type: _.get(alert, "msgType"),
            scope: _.get(alert, "scope"),
            restriction: '',
            addresses: [],
            code: '',
            note: '',
            headline: _.get(alert, "info.headline"),
            instruction: _.get(alert, "info.instruction"),
            website: _.get(alert, "info.web")
          },
          area: {
            description:_.get(alert, "info.area.areaDesc"),
            geometry: {
                type: 'Polygon',
                coordinates: [_.get(modifedArea, "polygon")]
            },
            centroid: {
                type: 'Point',
                coordinates: _.get(modifedArea, "centroid")
            },
            altitude: 3034927949938688,
            ceiling: 5185134378614784
          },
        resources: [],
        reportedAt:  _.get(alert, "info.onset"),
        expectedAt:  _.get(alert, "info.onset"),
        occuredAt: "",
        endedAt:  _.get(alert, "info.expires"),
        direction: "",
        _id:  _.get(alert, "identifier"),
        updatedAt: _.get(alert, "info.onset"),
        createdAt: _.get(alert, "info.onset")
    }

    return modifiedAlert;
}

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/api/v1/alerts', function (req, res) {
    // First read existing users.
    fs.readFile( __dirname + "/" + "tma.alert.json", 'utf8', function (err, data) {
       var alerts = JSON.parse( data );
       modifiedAlerts = alerts.map( alert => modifyAlert(alert));

       res.end( JSON.stringify(modifiedAlerts));
    });
 })


app.get('/api/v1/alert/:id', function (req, res) {
    // First read existing users.
    fs.readFile( __dirname + "/" + "tma.alert.json", 'utf8', function (err, data) {
       var alerts = JSON.parse( data );
       
       var alert = alerts.find(function (alert) {
        var id = alert.identifier;
           return id === req.params.id;
       });
       var transforemedAlert = modifyAlert(alert);

       res.end( JSON.stringify(transforemedAlert));
    });
 })

var server = app.listen(8082, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})