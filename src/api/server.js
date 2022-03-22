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


app.use(express.static(path.join(__dirname, "../../", 'build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});

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


const httpsServer = https.createServer(credentials, app);
httpsServer.listen(process.env.REST_API_PORT, () =>
  console.log(`HTTPS Server listening on port ${process.env.REST_API_PORT}!`));