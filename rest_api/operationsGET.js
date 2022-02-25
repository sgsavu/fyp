const keccak256 = require('keccak256')
const { injectChainData, NetworkTables, ExternalGatewayContract } = require("./blockchain")

async function callViewChainFunction(obj) {

    injectChainData(obj)

    if (obj.operation == "hasRole")
        obj.data.role = keccak256(obj.data.role)

    return await obj.smartContract.methods
    [obj.operation](...(Object.values(obj.data)))
        .call();
}

function secretFunction(obj) {

    console.log(ExternalGatewayContract)
    console.log(NetworkTables)
    
    if (obj.operation == "getContract")
        return ExternalGatewayContract
    else if (obj.operation =="getNetworkTables")
        return NetworkTables

}

exports.callViewChainFunction = callViewChainFunction
exports.secretFunction = secretFunction