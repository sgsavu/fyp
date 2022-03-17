import { alerts, deleteFieldKey, entryDataState, updateDataState } from "../app/appActions";
import store from "../store";
import { getUserAccount } from "../reduxUtils";
import { getContractFor } from "../../components/utils/GatewayParser";
import { refreshVehicle } from "../data/dataActions";
import { useDispatch } from "react-redux";


function refreshVehicleInfo(tokenId) {
    return async (dispatch) => {
        var allVehicles = await store.getState().data.allVehicles
        allVehicles[tokenId] = (await refreshVehicle(tokenId))[tokenId]
        dispatch(updateDataState({ field: "allVehicles", value: allVehicles }));
    }
}

function removeVehicleFromAll(token) {
    return async (dispatch) => {
        dispatch(deleteFieldKey({ field: "allVehicles", key: token }));
    }
}


export function subscribeToEvent(eventName) {
    return async (dispatch) => {
        const smartContract = await getContractFor("events", eventName)
        smartContract.events[eventName]({}, (error, event) => {
            console.log('New Refresh Event Detected: ', event)
            if (!error) {
                dispatch(refreshVehicleInfo(event.returnValues.tokenId))
            }
            else {
            }
        })
    }
}

export function subscribeToTransfers() {
    return async (dispatch) => {
        const smartContract = (await getContractFor("events", "Transfer"))
        smartContract.events.Transfer({
        }, function (error, event) {
            console.log("Transfer", event)
            if (!error) {
                if (event.returnValues.to == "0x0000000000000000000000000000000000000000") {
                    dispatch(removeVehicleFromAll(event.returnValues.tokenId))
                }
                else {
                    dispatch(refreshVehicleInfo(event.returnValues.tokenId))
                }
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
                if (event.returnValues.owner == thisAccount) {
                    dispatch(updateDataState({ field: "approval", value: event.returnValues.tokenId }));
                }
            }
        })
    }
}

