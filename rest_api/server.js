require('dotenv').config();
const express = require('express');
const http = require('http');
const https = require('https');
const { operationGET, callViewChainFunction } = require("./operationsGET")
const { operationPOST, callChainFunction } = require("./operationsPOST")
const { injectChainData } = require("./blockchain")
const { credentials } = require("./TLS")
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {

  var result = null

  try {
    injectChainData(req.body)
    result = await callViewChainFunction(req.body)
  }
  catch (err) {
    result = err.message
  }

  return res.send({
    "result": result
  })
});

app.post('/', async (req, res) => {

  var result = null

  try {
    injectChainData(req.body)
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