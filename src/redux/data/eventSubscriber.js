import { updateDataState } from "../app/appActions";
import store from "../store";


export function subscribeToSaleStatus(list) {
    return async (dispatch) => {
        const smartContract = await store.getState().blockchain.smartContract

        list.forEach(element => {
            smartContract.events.SaleStatus({
                filter: { tokenId: element },
            }, function (error, event) {

                console.log("SaleStatus", event)

                if (event.returnValues.status == true)
                {   console.log("add")
                    if (event.returnValues.isAuction == true)
                        dispatch(addToSale("auctions",element))
                    else if (event.returnValues.isAuction == false)
                        dispatch(addToSale("instant",element))
                }
                else if (event.returnValues.status == false)
                {   
                    console.log("remove")
                    dispatch(removeFromSale(element))
                }

        })
        });
    }
}


function addToSale(type,token) {
    return async (dispatch) => {
        var saleVehicles = await store.getState().data.saleVehicles
        var allVehicles = await store.getState().data.allVehicles

        saleVehicles[type][token] = allVehicles[token]

        dispatch(updateDataState({ field: "saleVehicles", value: saleVehicles }));
    }
}

function removeFromSale(token) {
    return async (dispatch) => {
        var saleVehicles = await store.getState().data.saleVehicles

        if (token in saleVehicles.instant) {
            delete saleVehicles.instant[token]
        } else if (token in saleVehicles.auctions) {
            delete saleVehicles.auctions[token]
        }

        dispatch(updateDataState({ field: "saleVehicles", value: saleVehicles }));
    }
}