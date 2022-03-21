const keccak256 = require('keccak256')
const { injectChainData} = require("./blockchain")

/**
  * Calls a blockchain view function
  * @param obj the accummulated query object passed in from the request
  * @returns {object} the response from the blockchain
  */
async function callViewChainFunction(obj) {

    injectChainData(obj)

    if (obj.operation == "hasRole")
        obj.data.role = keccak256(obj.data.role)

    return await obj.smartContract.methods
    [obj.operation](...(Object.values(obj.data)))
        .call();
}

exports.callViewChainFunction = callViewChainFunction