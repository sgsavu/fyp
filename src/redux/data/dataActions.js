import { roles } from "../../components/utils/Roles";
import { weiToMyCurrency } from "../../components/utils/Exchange";
import store from "../store";
import { getRole, callViewChainFunction } from "../../components/utils/GatewayParser";
import { alerts, updateDataState } from "../app/appActions";
import { getUserAccount } from "../reduxUtils";

var ipfsGateways = ["gateway.ipfs.io","ipfs.io","dweb.link","infura-ipfs.io","via0.com",]

/**
 * This function assembles the data from a request into vehicle objects used
 * throught the application
 * @param response the response from the blockchain
 * @returns {Object} Object of vehicle objects
 */
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

    let vehicleMetadata = null

    var k  = 0
    while (k < ipfsGateways.length) {
      var r = await fetch("https://" + ipfsGateways[k] + "/ipfs/" + URI)
      if (r.status!=200) {
        k++;
        continue;
      }
      vehicleMetadata = await r.json()
      break;
    }

    if (vehicleMetadata==null) {
      throw Error("Cannot fetch URI from any Gateway.")
    }

    vehicleMetadata.image = "https://" + ipfsGateways[k] + "/ipfs/" + vehicleMetadata.image

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

/**
 * This call a data refresh on a specific vehicle which is then assembled into
 * a vehicle object
 * @param tokenId the token you with to do the refresh on.
 * @returns {Object} Object of vehicle objects
 */
export async function refreshVehicle(tokenId) {
  const response = await callViewChainFunction("refreshOne", [tokenId])
  return await assembleVehicleObjects(response)
}

/**
 * Wrapper function which grabs all the vehicle information from the blockchain
 * @return {bruh}
 */
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




/**
 * Updates the redux store value of the allVehicles object to the newly fetched
 * data of all the vehicles from the blockchain
 */
export function getDefaultVehicles() {
  return async (dispatch) => {
    var all = await getEverything()
    console.log(all)
    dispatch(updateDataState({ field: "allVehicles", value: all }));
  }
}

/**
 * Clears any existance of user data from the app. In this case removes the role
 * stored in the app's store.
 */
export const clearMyData = () => {
  return async (dispatch) => {
    dispatch(updateDataState({ field: "myRole", value: roles.VIEWER_ROLE }));
  }
}

/**
 * Gets the authenticated data for the app when the user logs in. In this case
 * it fetches the role and updates it in the redux store.
 */
export function getAuthenticatedData() {
  return async (dispatch) => {
    await dispatch(updateDataState({ field: "myRole", value: await getRole(await getUserAccount()) }));
  }
}

/**
 * Fethces the data for the current user grabbing the default vehicles and the authenticated data if the user
 * is logged in or just the default vehicles if the user is not logged in.
 */
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

/**
 * Updates the app's redux store value for the display currency to the one provided
 * @param value The currency symbol we wish to use throughout the app.
 */
export const updatePrefferedCurrency = (value) => {
  return async (dispatch) => {
    dispatch(updateDataState({ field: "displayCurrency", value: value }));
  };
};

/**
 * Refreshes each display price for each vehicle to the one currently stored in the app's
 * redux store. It applies conversion of the original base price in Wei to this new currency
 * for which we wish to display. Then updates the object vehicles with the new data.
 */
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