var ExternalGatewayContract = require('../src/abis/ExternalGateway.json');
const { rpcUrls } = require("./rpcUrls")
const Web3 = require('web3');

function getDeployedChains() {
    const deployed = {}
    for (var property in ExternalGatewayContract.networks)
        deployed[Web3.utils.numberToHex(property)] = ExternalGatewayContract.networks[property].address
    return deployed
}

function injectChainData(object) {
    object.data.web3Instance = new Web3(rpcUrls[object.chain]);
    object.data.smartContract = new object.data.web3Instance.eth.Contract(
        ExternalGatewayContract.abi,
        getDeployedChains()[object.chain]
    );
}

async function sendAuthenticatedTransaction(data) {

    const account = data.web3Instance.eth.accounts.privateKeyToAccount(data.private_key)
    const tx = {
        nonce: data.web3Instance.utils.toHex(await (data.web3Instance.eth.getTransactionCount(account.address))),
        //value: web3Instance.utils.toHex(web3Instance.utils.toWei('0', 'ether')),
        gasLimit: data.web3Instance.utils.toHex(2100000),
        //gasPrice: web3Instance.utils.toHex(web3Instance.utils.toWei('6', 'gwei')),
        from: account.address,
        to: data.smartContract._address,
        data: data.smartContractMethod.encodeABI()
    };
    const signedTx = await data.web3Instance.eth.accounts.signTransaction(tx, data.private_key)
    const sentTx = await data.web3Instance.eth.sendSignedTransaction(signedTx.rawTransaction)
    return sentTx
}

exports.getDeployedChains = getDeployedChains;
exports.injectChainData = injectChainData;
exports.sendAuthenticatedTransaction = sendAuthenticatedTransaction;
