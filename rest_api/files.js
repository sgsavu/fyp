const fs = require('fs')
var path = require('path');

function readJSONFile(path) {
    return JSON.parse(fs.readFileSync(path));
}

function getFile(name) {
    return readJSONFile(path.join(__dirname, '/resources/', name))
}

exports.getFile = getFile