import { roles } from "../../components/utils/Roles";
import { weiToMyCurrency } from "../../components/utils/Exchange";
import store from "../store";
import { getRole, callViewChainFunction } from "../../components/utils/GatewayParser";
import { alerts, updateDataState } from "../app/appActions";
import { getUserAccount } from "../reduxUtils";




async function refreshOne(tokenId) {
  const unos = await callViewChainFunction("refreshOne", [tokenId])

  console.log('daone', unos)

  var id = unos.id
  var URI = unos.uri
  var owner = unos.owner
  var garage = unos.garage

  var isForSale = unos.sale
  var price = unos.price
  var isAuction = unos.auction
  var topBidder = unos.bidder

}


async function getEverything() {
  var startTime = performance.now()

  refreshOne(0)
  let allVehicles = {}

  var a = performance.now()
  const unos = await callViewChainFunction("getEverything", [])
  var b = performance.now()

  for (var i = 0; i < unos.ids.length; i++) {
    var id = unos.ids[i]
    var URI = unos.uris[i]
    var owner = unos.owners[i]
    var garage = unos.garages[i]

    var isForSale = unos.sales[i]
    var price = unos.prices[i]
    var isAuction = unos.auctions[i]
    var topBidder = unos.bidders[i]

    allVehicles[id] = {}

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
    allVehicles[id] = vehicleMetadata;
  }

  var endTime = performance.now()
  console.log("performance for ALL", endTime - startTime)
  console.log("performance for a", b - a)
  return allVehicles
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
    let allVehicles = await getEverything()
    console.log(allVehicles)
    dispatch(updateDataState({ field: "allVehicles", value: allVehicles }));
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