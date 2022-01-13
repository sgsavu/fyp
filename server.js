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


const createMetaDataAndMint = async (data) => {

  try {

    const response = await axios.get(data.image, { responseType: 'arraybuffer' })
    const buffer = Buffer.from(response.data, "utf-8")

    const addedImage = await ipfsClient.add(buffer);
    const metaDataObj = {
      image: ipfsBaseUrl + addedImage.path,
      created: Date.now(),
      updated: Date.now(),
      attributes: data.attributes,
      nonce1: scramble(data.from),
      nonce2: randomIntFromInterval(1, 1000000)
    };

    console.log(metaDataObj)

    const addedMetaData = await ipfsClient.add(JSON.stringify(metaDataObj));
    const transactionCount = await web3Instance.eth.getTransactionCount(data.from);

    const tx = {
      nonce: web3Instance.utils.toHex(transactionCount),
      //value: web3Instance.utils.toHex(web3Instance.utils.toWei('0', 'ether')),
      gasLimit: web3Instance.utils.toHex(2100000),
      //gasPrice: web3Instance.utils.toHex(web3Instance.utils.toWei('6', 'gwei')),
      from: data.from,
      to: smartContract._address,
      data: smartContract.methods.createVehicle(ipfsBaseUrl + addedMetaData.path).encodeABI()
    };

    const signedTx = await web3Instance.eth.accounts.signTransaction(tx, data.private_key)
    const sentTx = await web3Instance.eth.sendSignedTransaction(signedTx.rawTransaction)

    return {
      "ipfsUrl": ipfsBaseUrl + addedMetaData.path,
      "tx": sentTx,
    }

  } catch (err) {
    return {
      "error": err.message
    }
  };
};


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


async function exists(tokenId) {
  return smartContract.methods.getIfTokenExists(tokenId).call()
}

operations = {
  "exists": exists
}

function loadChainSpecificData(chain) {
  web3Instance = new Web3(rpcUrls[chain]);
  smartContract = loadSmartContract(chain)
}


app.get('/', async (req, res) => {

  loadChainSpecificData(req.body.chain)

  return res.send(await (operations[req.body.operation](req.body.tokenId)))
});

app.post('/mint', async (req, res) => {

  loadChainSpecificData(req.body.chain)

  return res.send(await (createMetaDataAndMint(req.body.data)));

});

app.put('/', (req, res) => {
  return res.send('Received a PUT HTTP method');
});

app.delete('/', (req, res) => {
  return res.send('Received a DELETE HTTP method');
});


var httpsServer = https.createServer(credentials, app);


httpsServer.listen(8443, () =>
  console.log(`HTTPS Server listening on port 8443!`));