const keccak256 = require('keccak256')


async function callViewChainFunction(obj) {

    if (obj.operation == "hasRole")
        obj.data.role = keccak256(obj.data.role)

    return await obj.smartContract.methods
    [obj.operation](...(Object.values(obj.data)))
        .call();
}

exports.callViewChainFunction = callViewChainFunction