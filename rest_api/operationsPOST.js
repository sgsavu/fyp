const { uploadToIPFS } = require("./ipfsTool")
const { sendAuthenticatedTransaction } = require("./blockchain")
const keccak256 = require('keccak256')
const { injectChainData } = require("./blockchain")

async function callChainFunction(obj) {

    injectChainData(obj)

    var response = {}

    if (obj.operation=="grantRole" || obj.operation=="revokeRole" )
        obj.data.role = keccak256(obj.data.role)
    else if (obj.operation=="mint")
    {   
        const tokenURI = await uploadToIPFS(obj)
        response.ipfsURI = tokenURI
        obj.data = {"uri":tokenURI}
    }

    obj.smartContractMethod = await obj.smartContract.methods[obj.operation](...(Object.values(obj.data)))

    const sentTx = await sendAuthenticatedTransaction(obj)
    response.tx = sentTx

    return response
}

exports.callChainFunction = callChainFunction