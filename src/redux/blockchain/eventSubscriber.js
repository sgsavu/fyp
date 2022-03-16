import { deleteFieldKey, entryDataState, updateDataState } from "../app/appActions";
import store from "../store";
import { getUserAccount } from "../reduxUtils";
import { getContractFor } from "../../components/utils/GatewayParser";
import { refreshVehicle } from "../data/dataActions";


export function subscribeToSaleStatus() {
    return async (dispatch) => {
        const smartContract = (await getContractFor("events", "SaleStatus"))
        smartContract.events.SaleStatus({
        }, function (error, event) {
            console.log("SaleStatus", event)
            if (!error) {
                dispatch(refreshVehicleData(event.returnValues.tokenId))
            }

        })
    }
}


export function subscribeToTransfers() {
    return async (dispatch) => {
        const smartContract = (await getContractFor("events", "Transfer"))
        const thisAccount = await getUserAccount()
        smartContract.events.Transfer({
        }, function (error, event) {
            console.log("Transfer", event)
            if (!error) {
                if (event.returnValues.to == "0x0000000000000000000000000000000000000000")
                {
                    dispatch(removeFromAll(event.returnValues.tokenId))
                }
                else {
                    dispatch(refreshVehicleData(event.returnValues.tokenId))
                }                    
            }
        })
    }
}

export function subscribeToNewPrice() {
    return async (dispatch) => {
        const smartContract = (await getContractFor("events", "NewPrice"))
        smartContract.events.NewPrice({
        }, function (error, event) {
            console.log("NewPrice", event)
            if (!error){
                dispatch(refreshVehicleData(event.returnValues.tokenId))
            }
        })
    }
}


export function subscribeToNewTopBidder() {
    return async (dispatch) => {
        const smartContract = (await getContractFor("events", "NewTopBidder"))
        smartContract.events.NewTopBidder({
        }, function (error, event) {
            console.log("NewTopBidder", event)
            if (!error){
                dispatch(refreshVehicleData(event.returnValues.tokenId))
            }
        })
    }
}

export function subscribeToNewGarageApproval() {
    return async (dispatch) => {
        const smartContract = (await getContractFor("events", "NewGarageApproval"))
        smartContract.events.NewGarageApproval({
        }, function (error, event) {
            console.log("NewGarageApproval", event)
            if (!error){
                dispatch(refreshVehicleData(event.returnValues.tokenId))
            }
        })
    }
}

export function subscribeToApproval() {
    return async (dispatch) => {
        const smartContract = (await getContractFor("events", "Approval"))
        const thisAccount = await getUserAccount()
        smartContract.events.Approval({
        }, function (error, event) {
            console.log("NewApproval", event)
            if (!error) {
                if (event.returnValues.owner = thisAccount) {
                    dispatch(updateDataState({ field: "approval", value: event.returnValues.tokenId }));
                }
            }
        })
    }
}


function refreshVehicleData (tokenId) {
    return async (dispatch) => {
        var allVehicles = await store.getState().data.allVehicles
        allVehicles[tokenId] = (await refreshVehicle(tokenId))[tokenId]
        dispatch(updateDataState({ field: "allVehicles", value: allVehicles }));
    }
}



function removeFromAll(token) {
    return async (dispatch) => {
        dispatch(deleteFieldKey({ field: "allVehicles", key: token }));
    }
}