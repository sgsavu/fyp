const fs = require('fs');

const privateKey = fs.readFileSync('rest_api/sslcert/localhost.key', 'utf8');
const certificate = fs.readFileSync('rest_api/sslcert/localhost.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

exports.credentials = credentials
