const { create } = require('ipfs-http-client')
const ipfsBaseUrl = "https://ipfs.infura.io/ipfs/";
const ipfsClient = create("https://ipfs.infura.io:5001/api/v0");
const { scramble, randomIntFromInterval } = require('./cryptographyUtils')
const { urlToBuffer } = require("./imageManipulation")

async function uploadToIPFS(data) {

    const ipfsImageHash = await ipfsClient.add(await urlToBuffer(data.image));

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

exports.uploadToIPFS = uploadToIPFS