const keccak256 = require('keccak256')
const { injectChainData} = require("./blockchain")
const { getFile } = require('./files')

async function callViewChainFunction(obj) {

    injectChainData(obj)

    if (obj.operation == "hasRole")
        obj.data.role = keccak256(obj.data.role)

    return await obj.smartContract.methods
    [obj.operation](...(Object.values(obj.data)))
        .call();
}

function secretFunction(obj) {
    
    if (obj.operation == "getContract")
        return getFile("ExternalGateway.json")
    else if (obj.operation == "getNetworkTables")
        return getFile("NetworkTables.json")

}

exports.callViewChainFunction = callViewChainFunction
exports.secretFunction = secretFunction