const { create } = require('ipfs-http-client')
const ipfsBaseUrl = "https://ipfs.infura.io/ipfs/";
const ipfsClient = create("https://ipfs.infura.io:5001/api/v0");
const { scramble, randomIntFromInterval } = require('./libraries/cryptographyUtils')
const { urlToBuffer } = require("./libraries/imageManipulation")

async function uploadToIPFS(obj) {

    const ipfsImageHash = await ipfsClient.add(await urlToBuffer(obj.data.image));

    const tokenMetadata = {
        image: ipfsBaseUrl + ipfsImageHash.path,
        created: Date.now(),
        updated: Date.now(),
        attributes: obj.data.attributes,
        nonce1: scramble((obj.web3Instance.eth.accounts.privateKeyToAccount(obj.private_key)).address),
        nonce2: randomIntFromInterval(1, 1000000)
    };

    const ipfsTokenHash = await ipfsClient.add(JSON.stringify(tokenMetadata));
    return ipfsBaseUrl + ipfsTokenHash.path
}

exports.uploadToIPFS = uploadToIPFS