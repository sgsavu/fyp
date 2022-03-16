import { roles } from "../../components/utils/Roles";
import { weiToMyCurrency } from "../../components/utils/Exchange";
import store from "../store";
import { getRole, callViewChainFunction } from "../../components/utils/GatewayParser";
import { alerts, updateDataState } from "../app/appActions";
import { getUserAccount } from "../reduxUtils";

async function assembleVehicleObjects(response) {

  let assembled = {}
  
  for (var i = 0; i < response.ids.length; i++) {
    var id = response.ids[i]
    var URI = response.uris[i]
    var owner = response.owners[i]
    var garage = response.garages[i]

    var isForSale = response.sales[i]
    var price = response.prices[i]
    var isAuction = response.auctions[i]
    var topBidder = response.bidders[i]

    assembled[id] = {}

    let vehicleMetadata = await (await fetch(URI)).json()

    vehicleMetadata.injected = {}
    vehicleMetadata.injected.id = id
    vehicleMetadata.injected.owner = owner
    vehicleMetadata.injected.garage = garage

    if (isForSale) {
      vehicleMetadata.injected.sale = true
      vehicleMetadata.injected.price = price
      vehicleMetadata.injected.display_price = await weiToMyCurrency(price)
      if (isAuction) {
        vehicleMetadata.injected.auction = true
        vehicleMetadata.injected.topBidder = topBidder
      }
      else {
        vehicleMetadata.injected.auction = false
      }
    }
    else {
      vehicleMetadata.injected.sale = false
    }
    assembled[id] = vehicleMetadata;
  }

  return assembled;
}

export async function refreshVehicle(tokenId) {
  const response = await callViewChainFunction("refreshOne", [tokenId])
  return await assembleVehicleObjects(response)
}

async function getEverything() {

  var startTime = performance.now()

  var a = performance.now()
  const response = await callViewChainFunction("getEverything", [])
  var b = performance.now()
  const assembled = await assembleVehicleObjects(response)

  var endTime = performance.now()
  console.log("performance for ALL", endTime - startTime)
  console.log("performance for a", b - a)
  return assembled
}


export function getSaleVehicles(allVehicles) {
  let saleVehicles = {}

  for (const [tokenId, metadata] of Object.entries(allVehicles)) {
    if (metadata.injected.sale == true) {
      saleVehicles[tokenId] = metadata
    }
  }

  return saleVehicles
}




export function getDefaultVehicles() {
  return async (dispatch) => {
    var all = await getEverything()
    console.log(all)
    dispatch(updateDataState({ field: "allVehicles", value: all }));
  }
}


export const clearMyData = () => {
  return async (dispatch) => {
    dispatch(updateDataState({ field: "myRole", value: roles.VIEWER_ROLE }));
  }
}

export function getAuthenticatedData() {
  return async (dispatch) => {
    await dispatch(updateDataState({ field: "myRole", value: await getRole(await getUserAccount()) }));
  }
}

export const fetchMyData = () => {
  return async (dispatch) => {
    dispatch(alerts({ alert: "loading", message: "Fetching data..." }))
    if (await store.getState().blockchain.account || await store.getState().blockchain.walletProvider) {
      await dispatch(getDefaultVehicles())
      await dispatch(getAuthenticatedData());
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

      let forsale = await store.getState().data.allVehicles

      for (var key of Object.keys(forsale)) {
        if (forsale[key].injected.sale)
          forsale[key].injected.display_price = await weiToMyCurrency(forsale[key].injected.price)
      }

      dispatch(updateDataState({ field: "allVehicles", value: forsale }));

    } catch (err) {
      dispatch(alerts({ alert: "error", message: err.message }))
    }
    dispatch(alerts({ alert: "loading" }))
  };
}