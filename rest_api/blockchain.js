const Web3 = require('web3');
const { getFile } = require('./files');


function checkFunctionLocation(functionName) {
    const CONTRACT_LIST = [getFile("ExternalGateway.json")]
    for (var contract in CONTRACT_LIST) {
        for (var func in CONTRACT_LIST[contract].abi) {
            if (CONTRACT_LIST[contract].abi[func].type == "function")
                if (CONTRACT_LIST[contract].abi[func].name == functionName)
                {
                    console.log(contract)
                    return CONTRACT_LIST[contract]
                }
                    
        }
    }

    return -1
}

function injectChainData(object) {
    var contract = checkFunctionLocation(object.operation)
    if (contract == -1)
        throw Error("Operation Not Supported")
    object.web3Instance = new Web3(getFile("NetworkTables.json")[object.chain]["rpcUrls"][0]);
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

function secretFunction(obj) {
    
    if (obj.operation == "getContract")
        return getFile("ExternalGateway.json")
    else if (obj.operation == "getNetworkTables")
        return getFile("NetworkTables.json")

}

exports.injectChainData = injectChainData;
exports.sendAuthenticatedTransaction = sendAuthenticatedTransaction;
exports.secretFunction = secretFunction