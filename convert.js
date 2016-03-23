var Q = require('q'),
    xml2js = require('xml2js'),
    mapsMe = require('./mapsMe'),
    colours = require('./colours'),
    parser = new xml2js.Parser(),
    AdmZip = require('adm-zip');

var parseString = Q.denodeify(parser.parseString);

var inputFile = process.argv[2],
    outputFile = process.argv[3];

if (!inputFile || !outputFile) {
    throw new Error('No input or output file specified');
}

var inputZip = new AdmZip(inputFile),
    entries = inputZip.getEntries(),
    kmlFileName;

if (entries.length !== 1) {
    throw new Error('Wrong number of files inside archive: ' + entries.length);
}

kmlFileName = entries[0].name;

Q.resolve(inputZip.readAsText(kmlFileName))
    .then(parseString)
    .then(transformXmlObject)
    .then(outputResult)
    .catch(function(error) {
        console.log('Error: ', error);
        console.log(error.stack);
    });

function transformXmlObject(xmlObject) {
    delete xmlObject.kml.Document[0].StyleMap;
    xmlObject.kml.Document[0].Style = mapsMe.styles;

    xmlObject.kml.Document[0].Folder.forEach(function(Folder) {
        Folder.Placemark.forEach(function(Placemark) {
            Placemark.styleUrl = getNewStyleUrl(Placemark.styleUrl[0]);
        })
    });

    return xmlObject;
}

function getNewStyleUrl(styleUrl) {
    var rgb,
        match;

    if (typeof styleUrl === 'string' && (match = styleUrl.match(/-([0-9a-f]{6})(-|$)/i))) {
        rgb = colours.hexToRgb(match[1]);
    }
    else {
        throw new Error('Cannot parse colour from styleUrl: ' + styleUrl)
    }

    return '#placemark-' + getClosestColourName(rgb);
}

function getClosestColourName(rgb) {
    var closest,
        closestDistance;

    for (var i = 0; i < mapsMe.colours.length; i++) {
        var distance = colours.getDistance(rgb, mapsMe.colours[i].rgb);

        if (closestDistance === undefined || distance < closestDistance) {
            closest = mapsMe.colours[i];
            closestDistance = distance;
        }
    }

    return closest.name;
}

function outputResult(xmlObject) {
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(xmlObject);

    var outputZip = new AdmZip();
    outputZip.addFile(kmlFileName, new Buffer(xml));
    outputZip.writeZip(outputFile);
}