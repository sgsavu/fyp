const { uploadToIPFS } = require("./ipfsTool")
const { sendAuthenticatedTransaction } = require("./blockchain")
const keccak256 = require('keccak256')

async function createVehicle(data) {
    data.public_key = (data.web3Instance.eth.accounts.privateKeyToAccount(data.private_key)).address
    const tokenURI = await uploadToIPFS(data)
    data.smartContractMethod = data.smartContract.methods.createVehicle(tokenURI)
    const sentTx = await sendAuthenticatedTransaction(data)

    return {
        "ipfsURI": tokenURI,
        "tx": sentTx,
    }
};

async function destroyVehicle(data) {
    data.smartContractMethod = data.smartContract.methods.destroyVehicle(data.tokenId)
    const sentTx = await sendAuthenticatedTransaction(data)

    return {
        "tx": sentTx,
    }
};

async function listForSale(data) {
    data.smartContractMethod = data.smartContract.methods.listForSale(data.tokenId, data.price)
    const sentTx = await sendAuthenticatedTransaction(data)

    return {
        "tx": sentTx,
    }
}

async function removeFromSale(data) {
    data.smartContractMethod = data.smartContract.methods.removeFromSale(data.tokenId)
    const sentTx = await sendAuthenticatedTransaction(data)

    return {
        "tx": sentTx,
    }
}

async function listAuction(data) {
    data.smartContractMethod = data.smartContract.methods.listAuction(data.tokenId, data.price)
    const sentTx = await sendAuthenticatedTransaction(data)

    return {
        "tx": sentTx,
    }
}

async function concludeAuction(data) {
    data.smartContractMethod = data.smartContract.methods.concludeAuction(data.tokenId)
    const sentTx = await sendAuthenticatedTransaction(data)

    return {
        "tx": sentTx,
    }
}

async function setVehiclePrice(data) {
    data.smartContractMethod = data.smartContract.methods.setVehiclePrice(data.tokenId, data.price)
    const sentTx = await sendAuthenticatedTransaction(data)

    return {
        "tx": sentTx,
    }
}

async function grantRole(data) {
    data.smartContractMethod = data.smartContract.methods.grantRole(keccak256(data.role), data.address)
    const sentTx = await sendAuthenticatedTransaction(data)

    return {
        "tx": sentTx,
    }
}

async function revokeRole(data) {
    data.smartContractMethod = data.smartContract.methods.revokeRole(keccak256(data.role), data.address)
    const sentTx = await sendAuthenticatedTransaction(data)

    return {
        "tx": sentTx,
    }
}

async function setOdometerAddress(data) {
    data.smartContractMethod = data.smartContract.methods.setOdometerAddress(data.tokenId, data.address)
    const sentTx = await sendAuthenticatedTransaction(data)

    return {
        "tx": sentTx,
    }
}

async function increaseOdometer(data) {
    data.smartContractMethod = data.smartContract.methods.increaseOdometer(data.tokenId, data.value)
    const sentTx = await sendAuthenticatedTransaction(data)

    return {
        "tx": sentTx,
    }
}

async function operationNotSupported() {
    return "Operation is not supported."
}

function operationPOST(operation) {
    switch (operation) {
        case "createVehicle":
            return createVehicle
        case "destroyVehicle":
            return destroyVehicle
        case "listForSale":
            return listForSale
        case "removeFromSale":
            return removeFromSale
        case "listAuction":
            return listAuction
        case "concludeAuction":
            return concludeAuction
        case "setVehiclePrice":
            return setVehiclePrice
        case "grantRole":
            return grantRole
        case "revokeRole":
            return revokeRole
        case "setOdometerAddress":
            return setOdometerAddress
        case "increaseOdometer":
            return increaseOdometer
        default:
            return operationNotSupported;
    }
}

exports.operationPOST = operationPOST