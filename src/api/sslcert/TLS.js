var path = require('path');
const { readFile } = require('../libraries/files');

const privateKey = readFile(path.join(__dirname, '/localhost.key'), 'utf8');
const certificate = readFile(path.join(__dirname, '/localhost.crt'), 'utf8');
const credentials = { key: privateKey, cert: certificate };
exports.credentials = credentials
