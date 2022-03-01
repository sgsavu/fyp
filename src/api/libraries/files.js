const fs = require('fs')

function readFile(path) {
    return fs.readFileSync(path,'utf8')
}

function readJSONFile(path) {
    return JSON.parse(fs.readFileSync(path));
}

exports.readFile = readFile
exports.readJSONFile = readJSONFile