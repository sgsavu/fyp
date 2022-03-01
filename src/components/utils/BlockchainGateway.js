import { roles } from "./PermissionsAndRoles";
import store from "../../redux/store";
import { myCurrencyToWei } from './PricesCoinsExchange'
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
    
    const theContract = await locateFunction(functionName)
    if (theContract==-1)
        throw Error ('Not supported')

    return await theContract.methods
    [functionName](...args)
        .call();
}

async function locateFunction(functionName) {

    const smartContracts = await store.getState().blockchain.smartContracts
    for (var contract in smartContracts) {
        if (Object.keys(smartContracts[contract].methods).includes(functionName))
            return smartContracts[contract]
    }
    return -1
}

export function callChainFunction(functionName, args) {
    return async (dispatch) => {

        const theContract = await locateFunction(functionName)
        if (theContract==-1)
            throw Error ('Not supported')

        const send_field = { from: await getUserAccount() }

        if (functionName == "buy") {
            send_field.value = await callViewChainFunction("getVehiclePrice", [args[0]])
        }
        else if (functionName == "bid") {
            const price = args[args.length - 1]
            args = args[0]
            send_field.value = await myCurrencyToWei(price)
        }
        else if (functionName == "listInstant" || functionName == "listAuction" || functionName == "setVehiclePrice") {
            const price = args[args.length - 1]
            args[args.length - 1] = await myCurrencyToWei(price)
        }
        else if (functionName == "approve")
        {
            args.unshift((await store.getState().blockchain.smartContracts)[0]._address)
        }

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