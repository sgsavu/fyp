const keccak256 = require('keccak256')


async function callViewChainFunction(obj,functionName, args) {

    if (functionName == "hasRole")
        args[0] = keccak256(args[0])

    return obj.smartContract.methods
    [functionName](...args)
        .call();
}

exports.callViewChainFunction = callViewChainFunction