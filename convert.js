var fs = require('fs'),
    Q = require('q'),
    xml2js = require('xml2js'),
    parser = new xml2js.Parser();

var readFile = Q.denodeify(fs.readFile),
    parseString = Q.denodeify(parser.parseString);

readFile('samples/sample_google_maps.kml')
    .then(parseString)
    .then(function(result) {
        console.dir(result);
        console.log('Done');

        var builder = new xml2js.Builder();
        var xml = builder.buildObject(result);
        console.log(xml);
    })
    .catch(function(error) {
        console.log('Error: ', error)
    });