function hexToRgb(hex) {
    return [
        parseInt(hex.substr(0, 2), 16),
        parseInt(hex.substr(2, 2), 16),
        parseInt(hex.substr(4, 2), 16)
    ]
}

function getDistance(rgb1, rgb2) {
    return Math.pow(((rgb2[0] - rgb1[0])), 2)
        +  Math.pow(((rgb2[1] - rgb1[1])), 2)
        +  Math.pow(((rgb2[2] - rgb1[2])), 2)
}

module.exports = {
    hexToRgb: hexToRgb,
    getDistance: getDistance
};