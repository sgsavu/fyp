async function getIfTokenExists(data) {
    return data.smartContract.methods.getIfTokenExists(data.tokenId).call()
}

async function tokenURI(data) {
    return data.smartContract.methods.tokenURI(data.tokenId).call()
}

async function isForSale(data) {
    return data.smartContract.methods.isForSale(data.tokenId).call()
}

async function isAuction(data) {
    return data.smartContract.methods.isAuction(data.tokenId).call()
}

async function getVehiclePrice(data) {
    return data.smartContract.methods.getVehiclePrice(data.tokenId).call()
}

async function getTopBidder(data) {
    return data.smartContract.methods.getTopBidder(data.tokenId).call()
}

async function hasRole(data) {
    return data.smartContract.methods.hasRole(data.role, data.account).call()
}

async function operationNotSupported() {
    return "Operation is not supported."
}

function operationGET(operation) {
    switch (operation) {
        case "getIfTokenExists":
            return getIfTokenExists
        case "tokenURI":
            return tokenURI
        case "isForSale":
            return isForSale;
        case "isAuction":
            return isAuction;
        case "getVehiclePrice":
            return getVehiclePrice;
        case "getTopBidder":
            return getTopBidder;
        case "hasRole":
            return hasRole;
        default:
            return operationNotSupported;
    }
}

exports.operationGET = operationGET