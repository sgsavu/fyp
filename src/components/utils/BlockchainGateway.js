import { roles } from "./PermissionsAndRoles";
import store from "../../redux/store";
import { myCurrencyToWei } from './PricesCoinsExchange'
import { alerts } from "../../redux/app/appActions";


export async function getUserAccount() {
    return await store
        .getState()
        .blockchain.account
}

export async function getVehicleMetadata(URI) {
    return await (await fetch(URI)).json();
}

export async function getVehicleURI(vehicleID) {
    return await store
        .getState()
        .blockchain.smartContract.methods
        .tokenURI(vehicleID)
        .call();
}

export async function getVehicleByIndex(index) {
    return await store
        .getState()
        .blockchain.smartContract.methods
        .tokenByIndex(index)
        .call();
}

export async function getRole(account) {
    for (const role in roles) {
        if (
            await store
                .getState()
                .blockchain.smartContract.methods
                .hasRole(roles[role], account)
                .call()
        )
            return roles[role]
    }
    return roles.USER_ROLE
}

export async function getAccountBalance(account) {
    return await store
        .getState()
        .blockchain.smartContract.methods.balanceOf(account)
        .call();
}

export async function getIfForSale(vehicle) {
    return await store
        .getState()
        .blockchain.smartContract.methods.isForSale(vehicle)
        .call();
}

export async function getIfAuction(vehicle) {
    return await store
        .getState()
        .blockchain.smartContract.methods.isAuction(vehicle)
        .call();
}

export async function getTotalNrOfVehicles() {
    return await store
        .getState()
        .blockchain.smartContract.methods.totalSupply()
        .call();
}

export async function getTopBidder(id) {
    return await store
        .getState()
        .blockchain.smartContract.methods.getTopBidder(id)
        .call();
}

export async function getVehicleOfOwnerByIndex(account, i) {
    return await store
        .getState()
        .blockchain.smartContract.methods
        .tokenOfOwnerByIndex(account, i)
        .call();
}

export async function getVehiclePrice(id) {
    return await store.getState().blockchain.smartContract.methods
        .getVehiclePrice(id)
        .call()
}

export async function ownerOf(token) {
    return await store.getState().blockchain.smartContract.methods
        .ownerOf(token)
        .call()
}

export async function getContractBalance() {
    return await store.getState().blockchain.smartContract.methods
        .getContractBalance()
        .call()
}

export async function getIfTokenExists(token) {
    return await store.getState().blockchain.smartContract.methods
        .getIfTokenExists(token)
        .call()
}

export async function getTotalNrOfOwners(token) {
    return await store.getState().blockchain.smartContract.methods
        .getTotalNrOfOwners(token)
        .call()
}

export async function getOwnerAtIndex(token, i) {
    return await store.getState().blockchain.smartContract.methods
        .getOwnerAtIndex(token, i)
        .call()
}

export async function getIfIsTopBidder(id) {
    return await getTopBidder(id) == await getUserAccount()
}

export async function getIfIsOwner(vehicleId) {
    return (await getUserAccount() == await ownerOf(vehicleId))
}


export function buyVehicle(vehicleId) {
    return async (dispatch) => {
        return await store.getState().blockchain.smartContract.methods
            .buyVehicle(vehicleId)
            .send({ from: await getUserAccount(), value: await getVehiclePrice(vehicleId) })
            .once("error", (err) => {
                dispatch(alerts({ alert: "other", message: `Transaction failed. ${err.message}` }))
            })
            .then((receipt) => {
                dispatch(alerts({ alert: "other", message: `Transaction successful.\n${formatTx(receipt)}` }))
            });
    }
}

export function bidVehicle(vehicleId, price) {
    return async (dispatch) => {
        return await store.getState().blockchain.smartContract.methods
            .bidVehicle(vehicleId)
            .send({ from: await getUserAccount(), value: await myCurrencyToWei(price) })
            .once("error", (err) => {
                dispatch(alerts({ alert: "other", message: `Transaction failed. ${err.message}` }))
            })
            .then((receipt) => {
                dispatch(alerts({ alert: "other", message: `Transaction successful.\n${formatTx(receipt)}` }))
            });
    }
}


export const listAuction = (vehicleId, price) => {
    return async (dispatch) => {
        return await store.getState().blockchain.smartContract.methods
            .listAuction(vehicleId, await myCurrencyToWei(price))
            .send({ from: await getUserAccount() })
            .once("error", (err) => {
                dispatch(alerts({ alert: "other", message: `Transaction failed. ${err.message}` }))
            })
            .then((receipt) => {
                dispatch(alerts({ alert: "other", message: `Transaction successful.\n${formatTx(receipt)}` }))
            });
    }
}



export const listForSale = (vehicleId, price) => {
    return async (dispatch) => {
        return await store.getState().blockchain.smartContract.methods
            .listForSale(vehicleId, await myCurrencyToWei(price))
            .send({ from: await getUserAccount() })
            .once("error", (err) => {
                console.log(err)
                dispatch(alerts({ alert: "other", message: `Transaction failed. ${err.message}` }))
            })
            .then((receipt) => {
                dispatch(alerts({ alert: "other", message: `Transaction successful.\n${formatTx(receipt)}` }))
            });
    }
}

export const removeFromSale = (vehicleId) => {
    return async (dispatch) => {
        return await store.getState().blockchain.smartContract.methods
            .removeFromSale(vehicleId)
            .send({ from: await getUserAccount() })
            .once("error", (err) => {
                dispatch(alerts({ alert: "other", message: `Transaction failed. ${err.message}` }))
            })
            .then((receipt) => {
                dispatch(alerts({ alert: "other", message: `Transaction successful.\n${formatTx(receipt)}` }))
            });
    }
}

export function setVehiclePrice(vehicleId, price) {
    return async (dispatch) => {
        return await store.getState().blockchain.smartContract.methods
            .setVehiclePrice(vehicleId, await myCurrencyToWei(price))
            .send({ from: await getUserAccount() })
            .once("error", (err) => {
                dispatch(alerts({ alert: "other", message: `Transaction failed. ${err.message}` }))
            })
            .then((receipt) => {
                dispatch(alerts({ alert: "other", message: `Transaction successful.\n${formatTx(receipt)}` }))
            });
    }
}


export function concludeAuction(vehicleId) {
    return async (dispatch) => {
        return await store.getState().blockchain.smartContract.methods
            .concludeAuction(vehicleId)
            .send({ from: await getUserAccount() })
            .once("error", (err) => {
                dispatch(alerts({ alert: "other", message: `Transaction failed. ${err.message}` }))
            })
            .then((receipt) => {
                dispatch(alerts({ alert: "other", message: `Transaction successful.\n${formatTx(receipt)}` }))
            });
    }
}

export function mint(uri) {
    return async (dispatch) => {
        return await store.getState().blockchain.smartContract.methods
            .createVehicle(uri)
            .send({ from: await getUserAccount() })
            .once("error", (err) => {
                dispatch(alerts({ alert: "other", message: `Transaction failed. ${err.message}` }))
            })
            .then((receipt) => {
                dispatch(alerts({ alert: "other", message: `Transaction successful.\n${formatTx(receipt)}` }))
            });
    }
}

function formatTx(tx) {
    let result = ""
    /*
    for (const [key, value] of Object.entries(tx)) {
        result = result + `\n${key}: ${value}`
    }
    */
    result = result + `\nBlock Nr:${tx.blockNumber}`
    result = result + `\nTx Index:${tx.transactionIndex}`
    return result
}