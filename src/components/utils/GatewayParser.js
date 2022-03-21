import { roles } from "./Roles";
import store from "../../redux/store";
import { alerts, TX } from "../../redux/app/appActions";
import { getUserAccount } from "../../redux/reduxUtils";

/**
 * This function tries to find the role of an account's address in the blockchcain
 * @param account the account for which we wish to find a role
 */
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

/**
 * This function is used to call a view function on the blockchain
 * It finds the contract in our ecosystem which uses that function and then
 * calls the contract with the functionName provided and the args specified
 * @param functionName the function we wish to call
 * @param args the arguments to pass to the function
 */
export async function callViewChainFunction(functionName, args) {

    const theContract = await getContractFor("methods", functionName)
    if (theContract == -1)
        throw Error('Not supported')

    return await theContract.methods
    [functionName](...args)
        .call();
}

/**
 * This function searches all of the contracts for a what in a
 * type of what. Eg. search for event "Approval" in "events" where
 * "Approval" is the what and "events" is the type of what.
 * It basically allows to search for anything in any key of the contract
 * object.
 * @param typeOfWhat the type of what we are trying to search
 * @param what what we are trying to search
 */
export async function getContractFor(typeOfWhat, what) {

    const smartContracts = await store.getState().blockchain.smartContracts
    for (var contract in smartContracts) {
        if (Object.keys(smartContracts[contract][typeOfWhat]).includes(what))
            return smartContracts[contract]
    }
    return -1
}

/**
 * This function is used to call a transaction function on the blockchain 
 * It makes sure that the transaction that is sent is authenticated.
 * @param functionName the name of the function we are trying to call
 * @param args the arguments to pass to the function
 * @param send_field the authenticated field to be sent to the blockchain.
 * This is empty by default and optional since the basic minimum, the user's
 * address is automatically added.
 */
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
    return { alert: "error", message: `Transaction failed. ${error.message}` }
}