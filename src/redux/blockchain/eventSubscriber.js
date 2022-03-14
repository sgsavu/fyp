import { deleteFieldKey, entryDataState, updateDataState } from "../app/appActions";
import store from "../store";
import { getVehicleInfo, injectIfApprovedGarage, injectIfTopBidder, injectPrice } from "../data/dataActions";
import { getUserAccount } from "../reduxUtils";
import { getContractFor } from "../../components/utils/GatewayParser";


export function subscribeToSaleStatus() {
    return async (dispatch) => {
        const smartContract = (await getContractFor("events", "SaleStatus"))
        smartContract.events.SaleStatus({
        }, function (error, event) {
            console.log("SaleStatus", event)
            if (!error) {
                if (event.returnValues.status == true) {
                    dispatch(addToSale(event.returnValues.tokenId))
                }
                else if (event.returnValues.status == false) {
                    dispatch(removeFromSale(event.returnValues.tokenId))
                }
                dispatch(addToMyVehicles(event.returnValues.tokenId))
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
                    dispatch(removeFromAll(event.returnValues.tokenId))
                if (event.returnValues.from == "0x0000000000000000000000000000000000000000")
                    dispatch(addToAll(event.returnValues.tokenId))
                if (event.returnValues.from == thisAccount)
                    dispatch(removeFromMyVehicles(event.returnValues.tokenId))
                if (event.returnValues.to == thisAccount)
                    dispatch(addToMyVehicles(event.returnValues.tokenId))
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
            if (!error)
                dispatch(updatePrice(event.returnValues.tokenId))
        })
    }
}


export function subscribeToNewTopBidder() {
    return async (dispatch) => {
        const smartContract = (await getContractFor("events", "NewTopBidder"))
        smartContract.events.NewTopBidder({
        }, function (error, event) {
            console.log("NewTopBidder", event)
            if (!error)
                dispatch(updateTopBidder(event.returnValues.tokenId))
        })
    }
}

export function subscribeToNewGarageApproval() {
    return async (dispatch) => {
        const smartContract = (await getContractFor("events", "NewGarageApproval"))
        smartContract.events.NewGarageApproval({
        }, function (error, event) {
            console.log("NewGarageApproval", event)
            if (!error)
                dispatch(updateGarage(event.returnValues.tokenId))
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
                    dispatch(updateApproval(event.returnValues.tokenId))
                }
            }
        })
    }
}

function updatePrice(tokenId) {
    return async (dispatch) => {

        var saleVehicles = await store.getState().data.saleVehicles

        if (tokenId in saleVehicles)
            await injectPrice(saleVehicles[tokenId])

        dispatch(updateDataState({ field: "saleVehicles", value: saleVehicles }));
    }
}

function updateTopBidder(tokenId) {
    return async (dispatch) => {

        var saleVehicles = await store.getState().data.saleVehicles

        if (tokenId in saleVehicles)
            await injectIfTopBidder(saleVehicles[tokenId])

        dispatch(updateDataState({ field: "saleVehicles", value: saleVehicles }));
    }
}

function updateGarage(tokenId) {
    return async (dispatch) => {
        var allVehicles = await store.getState().data.allVehicles

        await injectIfApprovedGarage(allVehicles[tokenId])

        dispatch(updateDataState({ field: "allVehicles", value: allVehicles }));
    }
}

function updateApproval(tokenId) {
    return async (dispatch) => {
        dispatch(updateDataState({ field: "approval", value: tokenId }));
    }
}



function addToSale(token) {
    return async (dispatch) => {
        dispatch(entryDataState({ field: "saleVehicles", key: token, value: await getVehicleInfo(token) }))
    }
}

function addToMyVehicles(token) {
    return async (dispatch) => {
        dispatch(entryDataState({ field: "myVehicles", key: token, value: await getVehicleInfo(token) }))
    }
}

function addToAll(token) {
    return async (dispatch) => {
        dispatch(entryDataState({ field: "allVehicles", key: token, value: await getVehicleInfo(token) }))
    }
}


function removeFromSale(token) {
    return async (dispatch) => {

        var saleVehicles = await store.getState().data.saleVehicles

        if (token in saleVehicles) {
            delete saleVehicles[token]
        }

        dispatch(updateDataState({ field: "saleVehicles", value: saleVehicles }));
    }
}

function removeFromMyVehicles(token) {
    return async (dispatch) => {
        dispatch(deleteFieldKey({ field: "myVehicles", key: token }));
    }
}


function removeFromAll(token) {
    return async (dispatch) => {
        dispatch(deleteFieldKey({ field: "allVehicles", key: token }));
    }
}