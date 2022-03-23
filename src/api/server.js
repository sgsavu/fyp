require('dotenv').config();
const express = require('express');
const http = require('http');
const https = require('https');
const path = require('path');
const { secretFunction } = require('./blockchain');
const { callViewChainFunction } = require("./operationsGET")
const { callChainFunction } = require("./operationsPOST")
const { credentials } = require("./sslcert/TLS")


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.enable('trust proxy')
app.use(function(request, response, next) {
    if (!request.secure) {
       return response.redirect("https://" + request.headers.host + request.url);
    }
    next();
})
app.use(express.static(path.join(__dirname, "../../", 'build')));


app.get('/api', async (req, res) => {
  var result = null

  try {

    if (req.body.operation == "getFile")
      result = secretFunction(req.body.file)
    else
      result = await callViewChainFunction(req.body)
  }
  catch (err) {
    result = err.message
  }

  return res.send({
    "result": result
  })
});

app.post('/api', async (req, res) => {

  var result = null

  try {
    result = await callChainFunction(req.body)
  }
  catch (err) {
    result = err.message
  }

  return res.send({
    "result": result
  })
});

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});


const httpServer = http.createServer(app)
const httpsServer = https.createServer(credentials, app);

httpServer.listen(process.env.REST_API_PORT_HTTP, () =>
  console.log(`HTTP Server listening on port ${process.env.REST_API_PORT_HTTP}!`));
httpsServer.listen(process.env.REST_API_PORT_HTTPS, () =>
  console.log(`HTTPS Server listening on port ${process.env.REST_API_PORT_HTTPS}!`));