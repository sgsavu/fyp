const Web3 = require('web3');
const { readJSONFile } = require('./libraries/files');
const path = require('path');


function locateFunction(functionName) {

    const CONTRACT_LIST = ["Gateway.json","Vehicle.json","Roles.json","Odometer.json","Management.json"]

    for (var i = 0 ; i < CONTRACT_LIST.length; i++)
        CONTRACT_LIST[i] = readJSONFile(path.join(__dirname, '/resources/', CONTRACT_LIST[i]))

    for (var contract in CONTRACT_LIST) {
        for (var func in CONTRACT_LIST[contract].abi) {
            if (CONTRACT_LIST[contract].abi[func].type == "function")
                if (CONTRACT_LIST[contract].abi[func].name == functionName)
                    return CONTRACT_LIST[contract]   
        }
    }
    return -1
}

function injectChainData(object) {
    var contract = locateFunction(object.operation)
    if (contract == -1)
        throw Error("Operation Not Supported")
    object.web3Instance = new Web3(readJSONFile(path.join(__dirname, '/resources/', "NetworkTables.json"))["networks"][object.chain]["rpcUrls"][0]);
    object.smartContract = new object.web3Instance.eth.Contract(
        contract.abi,
        contract["networks"][object.web3Instance.utils.hexToNumber(object.chain)]["address"]
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

function secretFunction(file) {

    if (file == "Odometer")
        return readJSONFile(path.join(__dirname, '/resources/', "Odometer.json"))
    else if (file == "Management")
        return readJSONFile(path.join(__dirname, '/resources/', "Management.json"))
    else if (file == "NetworkTables")
        return readJSONFile(path.join(__dirname, '/resources/', "NetworkTables.json"))
    
    throw Error("Operation Not Supported")
}

exports.injectChainData = injectChainData;
exports.sendAuthenticatedTransaction = sendAuthenticatedTransaction;
exports.secretFunction = secretFunction