require('dotenv').config();
const ExternalGatewayContract = require('./src/abis/ExternalGateway.json');
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var Web3 = require('web3');
const { create } = require('ipfs-http-client')
const ipfsBaseUrl = "https://ipfs.infura.io/ipfs/";
const ipfsClient = create("https://ipfs.infura.io:5001/api/v0");


var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey = fs.readFileSync('sslcert/localhost.key', 'utf8');
var certificate = fs.readFileSync('sslcert/localhost.crt', 'utf8');
var credentials = { key: privateKey, cert: certificate };



rpcUrls = {
  "0xa86a": 'https://api.avax.network/ext/bc/C/rpc',
  "0xa869": "https://api.avax-test.network/ext/bc/C/rpc",
  "0x89": 'https://rpc-mainnet.maticvigil.com',
  '0x13881': 'https://rpc-mumbai.maticvigil.com/',
  '0xfa': 'https://rpc.ftm.tools/',
  '0xfa2': 'https://rpc.testnet.fantom.network/',
  '0x505': 'https://rpc.moonriver.moonbeam.network',
  '0x507': 'https://rpc.testnet.moonbeam.network',
  '0x4': 'https://rinkeby.infura.io/v3/a4e7eec756004287a7b715dbe92cc57c',
  '0x3': 'https://ropsten.infura.io/v3/a4e7eec756004287a7b715dbe92cc57c'
}


const scramble = (string) => {

  var x = string.split('').sort(function () { return 0.5 - Math.random() }).join('');
  function substitute(str) {
    var pos = Math.floor(Math.random() * str.length);
    return str.substring(0, pos) + getRandomLetter() + str.substring(pos + 1);
  }
  function getRandomLetter() {
    var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var pos = Math.floor(Math.random() * letters.length);
    return letters.charAt(pos);
  }
  for (var i = 0; i < randomIntFromInterval(1, 10); i++) {
    x = string.split('').sort(function () { return 0.5 - Math.random() }).join('');
    x = substitute(x)
  }
  return x
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}



async function uploadToIPFS(data) {

  const response = await axios.get(data.image, { responseType: 'arraybuffer' })
  const imageBuffer = Buffer.from(response.data, "utf-8")
  const ipfsImageHash = await ipfsClient.add(imageBuffer);

  const tokenMetadata = {
    image: ipfsBaseUrl + ipfsImageHash.path,
    created: Date.now(),
    updated: Date.now(),
    attributes: data.attributes,
    nonce1: scramble(data.public_key),
    nonce2: randomIntFromInterval(1, 1000000)
  };

  const ipfsTokenHash = await ipfsClient.add(JSON.stringify(tokenMetadata));
  return ipfsBaseUrl + ipfsTokenHash.path
}

async function sendAuthenticatedTransaction(data) {

  const account = web3Instance.eth.accounts.privateKeyToAccount(data.private_key)
  const tx = {
    nonce: web3Instance.utils.toHex(await (web3Instance.eth.getTransactionCount(account.address))),
    //value: web3Instance.utils.toHex(web3Instance.utils.toWei('0', 'ether')),
    gasLimit: web3Instance.utils.toHex(2100000),
    //gasPrice: web3Instance.utils.toHex(web3Instance.utils.toWei('6', 'gwei')),
    from: account.address,
    to: smartContract._address,
    data: data.smartContractMethod.encodeABI()
  };
  const signedTx = await web3Instance.eth.accounts.signTransaction(tx, data.private_key)
  const sentTx = await web3Instance.eth.sendSignedTransaction(signedTx.rawTransaction)
  return sentTx
}


async function createVehicle(data) {
  data.public_key = (web3Instance.eth.accounts.privateKeyToAccount(data.private_key)).address
  const tokenURI = await uploadToIPFS(data)
  data.smartContractMethod = smartContract.methods.createVehicle(tokenURI)
  const sentTx = await sendAuthenticatedTransaction(data)

  return {
    "ipfsURI": tokenURI,
    "tx": sentTx,
  }
};

async function destroyVehicle(data) {
  data.smartContractMethod = smartContract.methods.destroyVehicle(data.tokenId)
  const sentTx = await sendAuthenticatedTransaction(data)

  return {
    "tx": sentTx,
  }
};

async function listForSale(data) {
  data.smartContractMethod = smartContract.methods.listForSale(data.tokenId, data.price)
  const sentTx = await sendAuthenticatedTransaction(data)

  return {
    "tx": sentTx,
  }
}

async function removeFromSale(data) {
  data.smartContractMethod = smartContract.methods.removeFromSale(data.tokenId)
  const sentTx = await sendAuthenticatedTransaction(data)

  return {
    "tx": sentTx,
  }
}

async function listAuction(data) {
  data.smartContractMethod = smartContract.methods.listAuction(data.tokenId, data.price)
  const sentTx = await sendAuthenticatedTransaction(data)

  return {
    "tx": sentTx,
  }
}

async function concludeAuction(data) {
  data.smartContractMethod = smartContract.methods.concludeAuction(data.tokenId)
  const sentTx = await sendAuthenticatedTransaction(data)

  return {
    "tx": sentTx,
  }
}

async function setVehiclePrice(data) {
  data.smartContractMethod = smartContract.methods.setVehiclePrice(data.tokenId, data.price)
  const sentTx = await sendAuthenticatedTransaction(data)

  return {
    "tx": sentTx,
  }
}



const getDeployedChains = (contract) => {
  const deployed = {}
  for (var property in contract.networks)
    deployed[Web3.utils.numberToHex(property)] = contract.networks[property].address
  return deployed
}

const loadSmartContract = (chain) => {
  return new web3Instance.eth.Contract(
    ExternalGatewayContract.abi,
    deployedChains[chain]
  );
}


var deployedChains = getDeployedChains(ExternalGatewayContract)

function loadChainSpecificData(chain) {
  web3Instance = new Web3(rpcUrls[chain]);
  smartContract = loadSmartContract(chain)
}

async function getIfTokenExists(tokenId) {
  return smartContract.methods.getIfTokenExists(tokenId).call()
}

async function tokenURI(tokenId) {
  return smartContract.methods.tokenURI(tokenId).call()
}

async function isForSale(tokenId) {
  return smartContract.methods.isForSale(tokenId).call()
}

async function isAuction(tokenId) {
  return smartContract.methods.isAuction(tokenId).call()
}

async function getVehiclePrice(tokenId) {
  return smartContract.methods.getVehiclePrice(tokenId).call()
}

async function getTopBidder(tokenId) {
  return smartContract.methods.getTopBidder(tokenId).call()
}

async function operationNotSupported() {
  return "Operation is not supported."
}

function getOperationGET(operation) {
  switch (operation) {
    case "getIfTokenExists":
      return getIfTokenExists
    case "tokenURI":
      return tokenURI
    case "isForSale":
      return isForSale;
    case "isAuction":
      return isAuction;
    case "getVehiclePrice":
      return getVehiclePrice;
    case "getTopBidder":
      return getTopBidder;
    default:
      return operationNotSupported;
  }
}

function getOperationPOST(operation) {
  switch (operation) {
    case "createVehicle":
      return createVehicle
    case "destroyVehicle":
      return destroyVehicle
    case "listForSale":
      return listForSale
    case "removeFromSale":
      return removeFromSale
    case "listAuction":
      return listAuction
    case "concludeAuction":
      return concludeAuction
    case "setVehiclePrice":
      return setVehiclePrice
    default:
      return operationNotSupported;
  }
}

//URLS

app.get('/', async (req, res) => {

  loadChainSpecificData(req.body.chain)

  var result = null

  try {
    result = await (getOperationGET(req.body.operation)(req.body.data.tokenId))
  }
  catch (err) {
    result = err.message
  }

  return res.send({
    "result": result
  })
});

app.post('/', async (req, res) => {

  loadChainSpecificData(req.body.chain)

  var result = null

  try {
    result = await (getOperationPOST(req.body.operation)(req.body.data))
  }
  catch (err) {
    result = err.message
  }

  return res.send({
    "result": result
  })
});

//MAIN STUFF

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(8443, () =>
  console.log(`HTTPS Server listening on port 8443!`));