

require('dotenv').config();


const ExternalGatewayContract = require('./src/abis/ExternalGateway.json');

console.log(ExternalGatewayContract.networks)


const express = require('express');
var Web3 = require('web3');
var web3 = new Web3("http://92.85.45.14:8547");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const SmartContractObj = new web3.eth.Contract(
  ExternalGatewayContract.abi,
  '0xa66689558916bB80252bC9c1c200e493235d5074'
);

SmartContractObj.methods.getIfTokenExists(0).call().then(console.log)


app.get('/', (req, res) => {
  return res.send('Received a GET HTTP method');
});

app.post('/mint', (req, res) => {
  web3.eth.getBlock(3150)
.then(console.log);
  return res.send(req.body);
});

app.put('/', (req, res) => {
  return res.send('Received a PUT HTTP method');
});

app.delete('/', (req, res) => {
  return res.send('Received a DELETE HTTP method');
});

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);
