import { roles, superUsers } from "../../components/utils/PermissionsAndRoles";
import { weiToMyCurrency } from "../../components/utils/PricesCoinsExchange";
import store from "../store";
import { getAccountBalance, getVehicleOfOwnerByIndex, getVehicleURI, getVehicleMetadata, getIfForSale, getIfAuction, getTopBidder, getTotalNrOfVehicles, getVehicleByIndex, getRole, getUserAccount, getVehiclePrice } from "../../components/utils/BlockchainGateway";
import { alerts, updateDataState } from "../app/appActions";

function injectTokenId(vehicle, tokenId) {
  vehicle.injected = {}
  vehicle.injected.id = tokenId
}

export async function injectPrice(vehicle) {
  vehicle.injected.price = await getVehiclePrice(vehicle.injected.id)
  vehicle.injected.display_price = await weiToMyCurrency(vehicle.injected.price)
}

export async function injectIfTopBidder(vehicle) {
  if (await getTopBidder(vehicle.injected.id) == await getUserAccount())
    vehicle.injected.bid = true
}

export async function getVehicleInfo(vehicleID) {
  let vehicleURI = await getVehicleURI(vehicleID)
  let vehicleMetadata = await getVehicleMetadata(vehicleURI)
  injectTokenId(vehicleMetadata, vehicleID)
  if (await getIfForSale(vehicleID)) {
    await injectPrice(vehicleMetadata)
    if (await getIfAuction(vehicleID)) {
      vehicleMetadata.injected.auction = true
      await injectIfTopBidder(vehicleMetadata)
    }
  }
  return vehicleMetadata
}

async function getAllVehicles() {
  let totalNrOfVehicles = await getTotalNrOfVehicles()
  let allVehicles = {}
  for (var i = 0; i < totalNrOfVehicles; i++) {
    let vehicleID = await getVehicleByIndex(i)
    allVehicles[vehicleID] = await getVehicleInfo(vehicleID)
  }
  return allVehicles
}

function getSaleVehicles(allVehicles) {
  let saleVehicles = { instant: {}, auctions: {} }

  for (const [tokenId, metadata] of Object.entries(allVehicles)) {
    if (metadata.injected.hasOwnProperty('price')) {
      if (metadata.injected.hasOwnProperty('auction'))
        saleVehicles.auctions[tokenId] = metadata
      else
        saleVehicles.instant[tokenId] = metadata
    }
  }

  return saleVehicles
}

async function getVehiclesForAccount(account) {
  let accountBalance = await getAccountBalance(account)
  let myVehicles = {}
  for (var i = 0; i < accountBalance; i++) {
    let vehicleID = await getVehicleOfOwnerByIndex(account, i)
    myVehicles[vehicleID] = await getVehicleInfo(vehicleID)
  }
  return myVehicles
}

function getMyBids(allVehicles) {
  let myBids = {}
  for (const [tokenId, metadata] of Object.entries(allVehicles)) {
    if (metadata.injected.hasOwnProperty('bid')) {
      myBids[tokenId] = metadata
    }
  }
  return myBids
}

export function getDefaultVehicles() {
  return async (dispatch) => {
    let allVehicles = await getAllVehicles()
    let saleVehicles = getSaleVehicles(allVehicles)

    console.log("all", allVehicles)
    console.log("sale", saleVehicles)
    dispatch(updateDataState({ field: "allVehicles", value: allVehicles }));
    dispatch(updateDataState({ field: "saleVehicles", value: saleVehicles }));

  }
}

export function getAuthenticatedVehicles() {
  return async (dispatch) => {
    let myVehicles = await getVehiclesForAccount(await getUserAccount())
    let myBids = getMyBids(await store.getState().data.allVehicles)

    console.log("myVehicles", myVehicles)
    console.log("myBids", myBids)
    dispatch(updateDataState({ field: "myVehicles", value: myVehicles }));
    dispatch(updateDataState({ field: "myBids", value: myBids }));
  }
}


export const clearMyData = () => {
  return async (dispatch) => {
    dispatch(updateDataState({ field: "myVehicles", value: [] }));
    dispatch(updateDataState({ field: "myBids", value: [] }));
    dispatch(updateDataState({ field: "myRole", value: roles.VIEWER_ROLE }));
  }
}

export const fetchMyData = () => {
  return async (dispatch) => {
    dispatch(alerts({ alert: "loading", message: "Fetching data..." }))
    if (await store.getState().blockchain.account || await store.getState().blockchain.walletProvider) {
      dispatch(getDefaultVehicles())
      dispatch(getAuthenticatedVehicles())
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
      for (const element in forsale.auctions) {
        forsale.auctions[element].injected.display_price = await weiToMyCurrency(forsale.auctions[element].injected.price)
      }
      for (const element in forsale.instant) {
        forsale.instant[element].injected.display_price = await weiToMyCurrency(forsale.instant[element].injected.price)
      }
      dispatch(updateDataState({ field: "saleVehicles", value: forsale }));
    } catch (err) {
      dispatch(alerts({ alert: "error", message: err.message }))
    }
    dispatch(alerts({ alert: "loading" }))
  };
}