var colourUtils = require('./colours');

var colours = [
    { name: 'blue', hex: '2f85ec' },
    { name: 'brown', hex: '6e4612' },
    { name: 'green', hex: '288b49' },
    { name: 'orange', hex: 'f16819' },
    { name: 'pink', hex: 'ef5fa3' },
    { name: 'purple', hex: '922074' },
    { name: 'red', hex: 'dc0024' },
    { name: 'yellow', hex: 'f7d925' }
];

colours.forEach(function(colour) {
    colour.rgb = colourUtils.hexToRgb(colour.hex);
});

var styles = colours.map(function(colour) {
    return {
        "$": { "id": "placemark-" + colour.name  },
        "IconStyle": [{ "Icon": [{ "href": ["http://mapswith.me/placemarks/placemark-" + colour.name + ".png"] }] }]
    };
});

module.exports = {
    colours: colours,
    styles: styles
};
