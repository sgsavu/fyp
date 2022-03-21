import { alerts, deleteFieldKey, entryDataState, updateDataState } from "../app/appActions";
import store from "../store";
import { getUserAccount } from "../reduxUtils";
import { getContractFor } from "../../components/utils/GatewayParser";
import { refreshVehicle } from "../data/dataActions";
import { useDispatch } from "react-redux";



/**
 * Function which refreshes the information/data of a certain token.
 * Updates the app's vehicles object with the freshly pulled data about
 * that vehicle.
 * @param tokenId the token for which we wish to refresh its data
 */
function refreshVehicleInfo(tokenId) {
    return async (dispatch) => {
        var allVehicles = await store.getState().data.allVehicles
        allVehicles[tokenId] = (await refreshVehicle(tokenId))[tokenId]
        dispatch(updateDataState({ field: "allVehicles", value: allVehicles }));
    }
}


/**
 * Function which removes a certain vehicle from the app's vehicle object
 * permanently.
 * @param token the vehicle we wish to remove
 */
function removeVehicleFromAll(token) {
    return async (dispatch) => {
        dispatch(deleteFieldKey({ field: "allVehicles", key: token }));
    }
}


/**
 * Function which subscribes to an event.
 * It automatically finds the specific contract for the event
 * we are trying to subscribe to and creates an event listener
 * on that object.
 * On event trigger refresh the data about that vehicle
 * @param eventName the event we are trying to subscribe to
 */
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

/**
 * Function which subscribes to the event Transfer
 * If the transfer is to the address 0x000.. then remove that vehicle from the
 * all vehicle object otheriwse just refresh the info on that vehicle
 */
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

/**
 * Function which subscribes to the event Approval.
 * On event trigger modify the approval field in the data redux.
 */
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

