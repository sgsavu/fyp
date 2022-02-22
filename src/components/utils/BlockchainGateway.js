import { roles } from "./PermissionsAndRoles";
import store from "../../redux/store";
import { myCurrencyToWei } from './PricesCoinsExchange'
import { alerts, TX } from "../../redux/app/appActions";
import { getNetworkExplorer } from "./NetworkTemplates";


export async function getUserAccount() {
    return await store
        .getState()
        .blockchain.account
}


export async function getRole(account) {
    for (const role in roles) {
        if (await callViewChainFunction("hasRole", [roles[role], account]))
            return roles[role]
    }
    return roles.USER_ROLE
}



export async function getIfIsTopBidder(id) {
    return await callViewChainFunction("getTopBidder", [id]) == await getUserAccount()
}

export async function getIfIsOwner(vehicleId) {
    return await callViewChainFunction("ownerOf", [vehicleId]) == await getUserAccount()
}



export async function callViewChainFunction(functionName, args) {
    return await store
        .getState()
        .blockchain.smartContract.methods
    [functionName](...args)
        .call();
}


export function callChainFunction(functionName, args) {
    return async (dispatch) => {

        const send_field = { from: await getUserAccount() }

        if (functionName == "buyVehicle") {
            send_field.value = await callViewChainFunction("getVehiclePrice", [args[0]])
        }
        else if (functionName == "bidVehicle") {
            const price = args[args.length - 1]
            send_field.value = await myCurrencyToWei(price)
        }
        else if (functionName == "listForSale" || functionName == "listAuction" || functionName == "setVehiclePrice") {
            const price = args[args.length - 1]
            args[args.length - 1] = await myCurrencyToWei(price)
        }

        dispatch(TX({ message: "+1" }))

        return await store.getState().blockchain.smartContract.methods
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
    const EXPLORER_BASE_URL = getNetworkExplorer(await store.getState().blockchain.currentNetwork) + "tx/"
    return { alert: "other", url: EXPLORER_BASE_URL + tx.transactionHash, message: `Transaction successful.\n` }
}

function failedAlert(error) {
    return { alert: "other", message: `Transaction failed. ${error.message}` }
}