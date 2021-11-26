import { roles } from "../../utils/PermissionsAndRoles";
import store from "../store";

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

export async function getTopBid(id) {
    return await store
        .getState()
        .blockchain.smartContract.methods.getTopBid(id)
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

export const getVehiclePrice = async (id) => {
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

export async function getIfExists(token) {
    return await store.getState().blockchain.smartContract.methods
        .getIfTokenExists(token)
        .call()
}