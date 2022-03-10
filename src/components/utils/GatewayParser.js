import { roles } from "./Roles";
import store from "../../redux/store";
import { myCurrencyToWei } from './Exchange'
import { alerts, TX } from "../../redux/app/appActions";
import { getUserAccount } from "../../redux/reduxUtils";


export async function getRole(account) {
    for (const role in roles) {
        if (await callViewChainFunction("hasRole", [roles[role], account]))
            return roles[role]
    }
    return roles.USER_ROLE
}

export const getNetworkRpcUrl = async (network) => {
    return await store.getState().blockchain.networkTables.networks[network].rpcUrls[0]
}

export const getNetworkExplorer = async (network) => {
    return await store.getState().blockchain.networkTables.networks[network].blockExplorerUrls[0]
}

export async function getIfIsTopBidder(id) {
    return await callViewChainFunction("getTopBidder", [id]) == await getUserAccount()
}

export async function getIfIsOwner(vehicleId) {
    return await callViewChainFunction("ownerOf", [vehicleId]) == await getUserAccount()
}

export async function callViewChainFunction(functionName, args) {

    const theContract = await getContractFor("methods", functionName)
    if (theContract == -1)
        throw Error('Not supported')

    return await theContract.methods
    [functionName](...args)
        .call();
}

export async function listenToEvent(eventName) {

}


export async function getContractFor(typeOfWhat, what) {

    const smartContracts = await store.getState().blockchain.smartContracts
    for (var contract in smartContracts) {
        if (Object.keys(smartContracts[contract][typeOfWhat]).includes(what))
            return smartContracts[contract]
    }
    return -1
}

export function callChainFunction(functionName, args, send_field = {}) {
    return async (dispatch) => {

        const theContract = await getContractFor("methods", functionName)
        if (theContract == -1)
            throw Error('Operation not supported')

        send_field.from = await getUserAccount()
        
        dispatch(TX({ message: "+1" }))

        return await theContract.methods
        [functionName](...args)
            .send(send_field)
            .once("error", (err) => {
                dispatch(alerts(failedAlert(err)))
                dispatch(TX({}))
            })
            .then(async (receipt) => {
                dispatch(alerts(await successAlert(receipt)))
                dispatch(TX({}))
            });
    }
}

async function successAlert(tx) {
    const EXPLORER_BASE_URL = await getNetworkExplorer(await store.getState().blockchain.currentNetwork) + "tx/"
    return { alert: "other", url: EXPLORER_BASE_URL + tx.transactionHash, message: `Transaction successful.\n` }
}

function failedAlert(error) {
    return { alert: "other", message: `Transaction failed. ${error.message}` }
}