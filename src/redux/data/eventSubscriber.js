import { getUserAccount } from "../../components/utils/BlockchainGateway";
import { updateDataState } from "../app/appActions";
import store from "../store";
import { getVehicleInfo, injectPrice } from "./dataActions";


export function subscribeToSaleStatus() {
    return async (dispatch) => {
        const smartContract = await store.getState().blockchain.smartContract
        smartContract.events.SaleStatus({
        }, function (error, event) {
            console.log("SaleStatus", event)
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
        const smartContract = await store.getState().blockchain.smartContract
        const thisAccount = await getUserAccount()
        smartContract.events.Transfer({
        }, function (error, event) {
            console.log("Transfer", event)
            if (event.returnValues.to == "0x0000000000000000000000000000000000000000")
                dispatch(removeFromAll(event.returnValues.tokenId))
            if (event.returnValues.from == "0x0000000000000000000000000000000000000000")
                dispatch(addToAll(event.returnValues.tokenId))
            if (event.returnValues.from == thisAccount)
                dispatch(removeFromMyVehicles(event.returnValues.tokenId))
            if (event.returnValues.to == thisAccount)
                dispatch(addToMyVehicles(event.returnValues.tokenId))
        })
    }
}

export function subscribeToNewPrice() {
    return async (dispatch) => {
        const smartContract = await store.getState().blockchain.smartContract
        smartContract.events.NewPrice({
        }, function (error, event) {
            dispatch(updatePrice(event.returnValues.tokenId))
        })
    }
}


export function subscribeToNewTopBidder() {
    return async (dispatch) => {
        const smartContract = await store.getState().blockchain.smartContract
        const thisAccount = await getUserAccount()
        smartContract.events.NewTopBidder({
        }, async function (error, event) {

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

        console.log(saleVehicles)

        dispatch(updateDataState({ field: "saleVehicles", value: saleVehicles }));
    }
}

function addToSale(type, token) {
    return async (dispatch) => {
        var saleVehicles = await store.getState().data.saleVehicles
        saleVehicles[type][token] = await getVehicleInfo(token)
        dispatch(updateDataState({ field: "saleVehicles", value: saleVehicles }));
    }
}

function addToMyVehicles(token) {
    return async (dispatch) => {
        var myVehicles = await store.getState().data.myVehicles
        myVehicles[token] = await getVehicleInfo(token)
        dispatch(updateDataState({ field: "myVehicles", value: myVehicles }));
    }
}

function addToAll(token) {
    return async (dispatch) => {
        var allVehicles = await store.getState().data.allVehicles
        allVehicles[token] = await getVehicleInfo(token)
        dispatch(updateDataState({ field: "allVehicles", value: allVehicles }));
    }
}

function addToBids(token) {
    return async (dispatch) => {
        var myBids = await store.getState().data.myBids
        myBids[token] = await getVehicleInfo(token)
        dispatch(updateDataState({ field: "myBids", value: myBids }));
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
        var myVehicles = await store.getState().data.myVehicles
        if (token in myVehicles) {
            delete myVehicles[token]
        }
        dispatch(updateDataState({ field: "myVehicles", value: myVehicles }));
    }
}

function removeFromAll(token) {
    return async (dispatch) => {
        var allVehicles = await store.getState().data.allVehicles
        if (token in allVehicles)
            delete allVehicles[token]
        dispatch(updateDataState({ field: "allVehicles", value: allVehicles }));
    }
}