var ExternalGatewayContract = require('../src/abis/ExternalGateway.json');

CONTRACT_LIST = [ExternalGatewayContract]

const { rpcUrls } = require("./rpcUrls")
const Web3 = require('web3');

function getDeployedChains() {
    const deployed = {}
    for (var contract in CONTRACT_LIST)
    {
        const chains_deployed = {}
        for (var property in CONTRACT_LIST[contract].networks)
            chains_deployed[Web3.utils.numberToHex(property)] = CONTRACT_LIST[contract].networks[property].address
        deployed[contract] = chains_deployed
    }
    return deployed
}

function checkFunctionLocation (functionName) {
    for (var contract in CONTRACT_LIST)
    {   
        for (var func in CONTRACT_LIST[contract].abi ) {
            if (CONTRACT_LIST[contract].abi[func].type == "function")
                if (CONTRACT_LIST[contract].abi[func].name == functionName)
                        return contract   
        }
    }

    return -1
}

function injectChainData(object) {
    var contractNr = checkFunctionLocation(object.operation)
    if (contractNr==-1)
        throw Error("Operation Not Supported")
    object.web3Instance = new Web3(rpcUrls[object.chain]);
    object.smartContract = new object.web3Instance.eth.Contract(
        CONTRACT_LIST[contractNr].abi,
        getDeployedChains()[contractNr][object.chain]
    );
}

async function sendAuthenticatedTransaction(obj) {

    const account = obj.web3Instance.eth.accounts.privateKeyToAccount(obj.private_key)
    const tx = {
        nonce: obj.web3Instance.utils.toHex(await (obj.web3Instance.eth.getTransactionCount(account.address))),
        //value: web3Instance.utils.toHex(web3Instance.utils.toWei('0', 'ether')),
        gasLimit: obj.web3Instance.utils.toHex(2100000),
        //gasPrice: web3Instance.utils.toHex(web3Instance.utils.toWei('6', 'gwei')),
        from: account.address,
        to: obj.smartContract._address,
        data: obj.smartContractMethod.encodeABI()
    };
    const signedTx = await obj.web3Instance.eth.accounts.signTransaction(tx, obj.private_key)
    const sentTx = await obj.web3Instance.eth.sendSignedTransaction(signedTx.rawTransaction)
    return sentTx
}

exports.getDeployedChains = getDeployedChains;
exports.injectChainData = injectChainData;
exports.sendAuthenticatedTransaction = sendAuthenticatedTransaction;
