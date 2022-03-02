import { deleteFieldKey, entryDataState, updateDataState } from "../app/appActions";
import store from "../store";
import { getVehicleInfo, injectIfApprovedGarage, injectIfTopBidder, injectPrice } from "../data/dataActions";
import { getUserAccount } from "../reduxUtils";


export function subscribeToSaleStatus() {
    return async (dispatch) => {
        const smartContract = (await store.getState().blockchain.smartContracts)[0]
        smartContract.events.SaleStatus({
        }, function (error, event) {
            console.log("SaleStatus", event)
            if (!error)
                if (event.returnValues.status == true) {
                    if (event.returnValues.isAuction == true)
                        dispatch(addToSale("auctions", event.returnValues.tokenId))
                    else if (event.returnValues.isAuction == false)
                        dispatch(addToSale("instant", event.returnValues.tokenId))
                }
                else if (event.returnValues.status == false) {
                    dispatch(removeFromSale(event.returnValues.tokenId))
                }

        })
    }
}


export function subscribeToTransfers() {
    return async (dispatch) => {
        const smartContract = (await store.getState().blockchain.smartContracts)[1]
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
        const smartContract = (await store.getState().blockchain.smartContracts)[0]
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
        const smartContract = (await store.getState().blockchain.smartContracts)[0]
        smartContract.events.NewTopBidder({
        },  function (error, event) {
            console.log("NewTopBidder", event)
            if (!error)
                dispatch(updateTopBidder(event.returnValues.tokenId))
        })
    }
}

export function subscribeToNewGarageApproval() {
    return async (dispatch) => {
        const smartContract = (await store.getState().blockchain.smartContracts)[1]
        smartContract.events.NewGarageApproval({
        },  function (error, event) {
            console.log("NewGarageApproval", event)
            if (!error)
                dispatch(updateGarage(event.returnValues.tokenId))
        })
    }
}

function updatePrice(tokenId) {
    return async (dispatch) => {
        var saleVehicles = await store.getState().data.saleVehicles

        if (tokenId in saleVehicles.instant)
            await injectPrice(saleVehicles.instant[tokenId])
        if (tokenId in saleVehicles.auctions)
            await injectPrice(saleVehicles.auctions[tokenId])

        dispatch(updateDataState({ field: "saleVehicles", value: saleVehicles }));
    }
}

function updateTopBidder(tokenId) {
    return async (dispatch) => {
        var saleVehicles = await store.getState().data.saleVehicles

        if (tokenId in saleVehicles.auctions)
            await injectIfTopBidder(saleVehicles.auctions[tokenId])

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



function addToSale(type, token) {
    return async (dispatch) => {
        dispatch(entryDataState({ field: "saleVehicles", subfield: type, key: token, value: await getVehicleInfo(token) }))
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
        if (token in saleVehicles.instant) {
            delete saleVehicles.instant[token]
        } else if (token in saleVehicles.auctions) {
            delete saleVehicles.auctions[token]
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