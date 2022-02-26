const keccak256 = require('keccak256')
const { injectChainData} = require("./blockchain")

async function callViewChainFunction(obj) {

    injectChainData(obj)

    if (obj.operation == "hasRole")
        obj.data.role = keccak256(obj.data.role)

    return await obj.smartContract.methods
    [obj.operation](...(Object.values(obj.data)))
        .call();
}

exports.callViewChainFunction = callViewChainFunction