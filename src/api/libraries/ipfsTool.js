const { create } = require('ipfs-http-client')
const ipfsClient = create("https://ipfs.infura.io:5001/api/v0");
const { scramble, randomIntFromInterval } = require('./cryptographyUtils')
const { urlToBuffer } = require("./imageManipulation")

/**
 * Uploads an object to ipfs
 * @param obj the object being uploaded to ipfs
 * @returns the ipfs hash of the uploaded object
 */
async function uploadToIPFS(obj) {

    const ipfsImageHash = await ipfsClient.add(await urlToBuffer(obj.data.image));

    const tokenMetadata = {
        image: ipfsImageHash.path,
        created: Date.now(),
        updated: Date.now(),
        attributes: obj.data.attributes,
        nonce1: scramble((obj.web3Instance.eth.accounts.privateKeyToAccount(obj.private_key)).address),
        nonce2: randomIntFromInterval(1, 1000000)
    };

    const ipfsTokenHash = await ipfsClient.add(JSON.stringify(tokenMetadata));
    return ipfsTokenHash.path
}

exports.uploadToIPFS = uploadToIPFS