import { superUsers } from "../../components/utils/PermissionsAndRoles";
import { weiToMyCurrency } from "../../components/utils/PricesCoinsExchange";
import store from "../store";
import { getAccountBalance, getVehicleOfOwnerByIndex, getVehicleURI, getVehicleMetadata, getIfForSale, getIfAuction, getTopBidder, getTotalNrOfVehicles, getVehicleByIndex, getRole, getUserAccount, getVehiclePrice } from "../../components/utils/BlockchainGateway";
import { alerts, updateDataState } from "../app/appActions";


function injectTokenId(vehicle, tokenId) {
  vehicle.injected = {}
  vehicle.injected.id = tokenId
}

async function injectPrice(vehicle) {
  vehicle.injected.price = await getVehiclePrice(vehicle.injected.id)
  vehicle.injected.display_price = await weiToMyCurrency(vehicle.injected.price)
}

async function getVehicleInfo(vehicleID) {
  let vehicleURI = await getVehicleURI(vehicleID)
  let vehicleMetadata = await getVehicleMetadata(vehicleURI)
  injectTokenId(vehicleMetadata, vehicleID)
  if (await getIfForSale(vehicleID)) {
    await injectPrice(vehicleMetadata)
    if (await getIfAuction(vehicleID)) {
      vehicleMetadata.injected.auction = true
      if (await getTopBidder(vehicleID) == await getUserAccount())
        vehicleMetadata.injected.bid = true
    }
  }
  return vehicleMetadata
}

async function getVehiclesForAccount(account) {
  let accountBalance = await getAccountBalance(account)
  let myVehicles = []
  for (var i = 0; i < accountBalance; i++) {
    let vehicleID = await getVehicleOfOwnerByIndex(account, i)
    myVehicles.push(await getVehicleInfo(vehicleID))
  }
  console.log("pulled my vehicles", myVehicles)
  return myVehicles
}

async function getAllVehicles() {

  let totalNrOfVehicles = await getTotalNrOfVehicles()
  let allVehicles = []
  for (var i = 0; i < totalNrOfVehicles; i++) {
    let vehicleID = await getVehicleByIndex(i)
    allVehicles.push(await getVehicleInfo(vehicleID))
  }
  console.log("pulled all vehicles", allVehicles)
  return allVehicles
}

async function getSaleVehicles(allVehicles) {

  let saleVehicles = { instant: [], auctions: [] }
  for (var i = 0; i < allVehicles.length; i++) {
    if (allVehicles[i].injected.hasOwnProperty('price')) {
      if (allVehicles[i].injected.hasOwnProperty('auction'))
        saleVehicles.auctions.push(allVehicles[i])
      else
        saleVehicles.instant.push(allVehicles[i])
    }
  }
  console.log("pulled forsale", saleVehicles)
  return saleVehicles
}

function getMyBids(allVehicles) {
  let myBids = []
  for (var i = 0; i < allVehicles.length; i++) {
    if (allVehicles[i].injected.hasOwnProperty('bid'))
      myBids.push(allVehicles[i])
  }
  console.log("pulled mybids", myBids)
  return myBids
}


export const fetchMyData = () => {
  return async (dispatch) => {
    dispatch(alerts("loading", "Fetching data for user."))
    try {
      if (superUsers.includes(await getRole(await getUserAccount()))) {
        dispatch(refresh("MY_VEHICLES"));
        dispatch(refresh("ALL_VEHICLES"));
        dispatch(refresh("SALE_VEHICLES"));
      }
      else {
        dispatch(refresh("SALE_VEHICLES"));
        dispatch(refresh("MY_VEHICLES"));
      }
      dispatch(refresh("ROLE"));
      dispatch(refresh("BIDS"));
    } catch (err) {
      dispatch(alerts("error", err.message))
    }
    dispatch(alerts("loading"))
  };
};

export const refresh = (code) => {
  return async (dispatch) => {
    dispatch(alerts("loading", `Refreshing data for ${code}`))
    try {
      switch (code) {
        case "MY_VEHICLES":
          dispatch(
            updateDataState({
              field: "myVehicles",
              value: await getVehiclesForAccount(await getUserAccount())
            })
          );
          break;
        case "SALE_VEHICLES":
          dispatch(
            updateDataState({
              field: "saleVehicles",
              value: await getSaleVehicles(await getAllVehicles())
            })
          );
          break;
        case "ALL_VEHICLES":
          dispatch(
            updateDataState({
              field: "allVehicles",
              value: await getAllVehicles()
            })
          );
          break;
        case "ROLE":
          dispatch(
            updateDataState({
              field: "myRole",
              value: await getRole(await getUserAccount())
            })
          );
          break;
        case "BIDS":
          dispatch(
            updateDataState({
              field: "myBids",
              value: await getMyBids(await getAllVehicles())
            })
          );
          break;
      }
    } catch (err) {
      dispatch(alerts("error", err.message))
    }
    dispatch(alerts("loading"))
  };
}

export const updatePrefferedCurrency = (value) => {
  return async (dispatch) => {
    dispatch(updateDataState({ field: "displayCurrency", value: value }));
  };
};

export const refreshDisplayPrices = () => {
  return async (dispatch) => {
    dispatch(alerts("loading", "Refreshing display prices."))
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
      dispatch(alerts("error", err.message))
    }
    dispatch(alerts("loading"))
  };
}