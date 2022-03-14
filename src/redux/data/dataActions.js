import { roles } from "../../components/utils/Roles";
import { weiToMyCurrency } from "../../components/utils/Exchange";
import store from "../store";
import { getRole, callViewChainFunction } from "../../components/utils/GatewayParser";
import { alerts, updateDataState } from "../app/appActions";
import { getUserAccount } from "../reduxUtils";

function injectTokenId(vehicle, tokenId) {
  vehicle.injected = {}
  vehicle.injected.id = tokenId
}

export async function injectOwner(vehicle) {
  vehicle.injected.owner = await callViewChainFunction("ownerOf", [vehicle.injected.id])
}

export async function injectPrice(vehicle) {
  vehicle.injected.price = await callViewChainFunction("getVehiclePrice", [vehicle.injected.id])
  vehicle.injected.display_price = await weiToMyCurrency(vehicle.injected.price)
}

export async function injectIfTopBidder(vehicle) {
  if (await callViewChainFunction("getTopBidder", [vehicle.injected.id]) == await getUserAccount())
    vehicle.injected.bid = true
  else
    vehicle.injected.bid = false

}

export async function injectIfApprovedGarage(vehicle) {
  if (await getUserAccount() == await callViewChainFunction("getApprovedGarage", [vehicle.injected.id]))
    vehicle.injected.garage = true
  else
    vehicle.injected.garage = false
}

export async function injectIfMine(vehicle) {
  if (await getUserAccount() == await callViewChainFunction("ownerOf", [vehicle.injected.id]))
    vehicle.injected.mine = true
  else
    vehicle.injected.mine = false
}


export async function getVehicleInfo(vehicleID) {
  let vehicleURI = await callViewChainFunction("tokenURI", [vehicleID])
  let vehicleMetadata = await (await fetch(vehicleURI)).json()

  injectTokenId(vehicleMetadata, vehicleID)
  await injectIfMine(vehicleMetadata)
  await injectIfApprovedGarage(vehicleMetadata)
  if (await callViewChainFunction("isForSale", [vehicleID])) {
    await injectOwner(vehicleMetadata)
    await injectPrice(vehicleMetadata)
    if (await callViewChainFunction("isAuction", [vehicleID])) {
      vehicleMetadata.injected.auction = true
      await injectIfTopBidder(vehicleMetadata)
    }
    else {
      vehicleMetadata.injected.auction = false

    }
  }
  return vehicleMetadata
}

async function getAllVehicles() {
  let totalNrOfVehicles = await callViewChainFunction("totalSupply", [])
  let allVehicles = {}
  for (var i = 0; i < totalNrOfVehicles; i++) {
    let vehicleID = await callViewChainFunction("tokenByIndex", [i])
    allVehicles[vehicleID] = await getVehicleInfo(vehicleID)
  }
  return allVehicles
}

function getSaleVehicles(allVehicles) {
  let saleVehicles = {}

  for (const [tokenId, metadata] of Object.entries(allVehicles)) {
    if (metadata.injected.hasOwnProperty('price')) {
      saleVehicles[tokenId] = metadata
    }
  }

  return saleVehicles
}

async function getVehiclesForAccount(account) {
  let accountBalance = await callViewChainFunction("balanceOf", [account])
  let myVehicles = {}
  for (var i = 0; i < accountBalance; i++) {
    let vehicleID = await callViewChainFunction("tokenOfOwnerByIndex", [account, i])
    myVehicles[vehicleID] = await getVehicleInfo(vehicleID)
  }
  return myVehicles
}



export function getDefaultVehicles() {
  return async (dispatch) => {
    let allVehicles = await getAllVehicles()
    let saleVehicles = getSaleVehicles(allVehicles)
    console.log(allVehicles)
    dispatch(updateDataState({ field: "allVehicles", value: allVehicles }));
    dispatch(updateDataState({ field: "saleVehicles", value: saleVehicles }));

  }
}

export function getAuthenticatedVehicles() {
  return async (dispatch) => {
    let myVehicles = await getVehiclesForAccount(await getUserAccount())
    console.log(myVehicles)
    dispatch(updateDataState({ field: "myVehicles", value: myVehicles }));
  }
}

export const clearMyData = () => {
  return async (dispatch) => {
    dispatch(updateDataState({ field: "myVehicles", value: [] }));
    dispatch(updateDataState({ field: "myRole", value: roles.VIEWER_ROLE }));
  }
}

export const fetchMyData = () => {
  return async (dispatch) => {
    dispatch(alerts({ alert: "loading", message: "Fetching data..." }))
    if (await store.getState().blockchain.account || await store.getState().blockchain.walletProvider) {
      await dispatch(getDefaultVehicles())
      await dispatch(getAuthenticatedVehicles())
      await dispatch(updateDataState({ field: "myRole", value: await getRole(await getUserAccount()) }));
    }
    else {
      await dispatch(getDefaultVehicles())
    }
    dispatch(alerts({ alert: "loading" }))
  };
};

export const updatePrefferedCurrency = (value) => {
  return async (dispatch) => {
    dispatch(updateDataState({ field: "displayCurrency", value: value }));
  };
};

export const refreshDisplayPrices = () => {
  return async (dispatch) => {
    dispatch(alerts({ alert: "loading", message: "Refreshing display prices." }))
    try {

      let forsale = await store.getState().data.saleVehicles

      for (var key of Object.keys(forsale)) {
        forsale[key].injected.display_price = await weiToMyCurrency(forsale[key].injected.price)
      }

      dispatch(updateDataState({ field: "saleVehicles", value: forsale }));

    } catch (err) {
      dispatch(alerts({ alert: "error", message: err.message }))
    }
    dispatch(alerts({ alert: "loading" }))
  };
}