require('dotenv').config();
const express = require('express');
const http = require('http');
const https = require('https');
const { operationGET, callViewChainFunction } = require("./operationsGET")
const { operationPOST } = require("./operationsPOST")
const { injectChainData } = require("./blockchain")
const { credentials } = require("./TLS")
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {

  injectChainData(req.body)

  var result = null

  try {
    result = await (callViewChainFunction(req.body.data2,req.body.operation,Object.values(req.body.data)))
  }
  catch (err) {
    result = err.message
  }

  return res.send({
    "result": result
  })
});

app.post('/', async (req, res) => {

  injectChainData(req.body)

  var result = null

  try {
    result = await (operationPOST(req.body.operation)(req.body.data))
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