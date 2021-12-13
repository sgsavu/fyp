import { viewAllPrivileged } from "../../utils/PermissionsAndRoles";
import { weiToMyCurrency } from "../../utils/PricesCoinsExchange";
import store from "../store";
import { getAccountBalance, getVehicleOfOwnerByIndex, getVehicleURI, getVehicleMetadata, getIfForSale, getIfAuction, getTopBidder, getTotalNrOfVehicles, getVehicleByIndex, getRole, getUserAccount } from "../../utils/BlockchainGateway";

const fetchDataRequest = () => {
  return {
    type: "FETCH_DATA_REQUEST",
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "FETCH_DATA_FAILED",
    payload: payload,
  };
};

const updateState = (payload) => {
  return {
    type: "UPDATE_STATE",
    payload: payload,
  };
};



async function injectTokenId(vehicle, tokenId) {
  vehicle.injected = {}
  vehicle.injected.id = tokenId
}

async function injectPrice(vehicle) {
  let price = await store
    .getState()
    .blockchain.smartContract.methods.getVehiclePrice(vehicle.injected.id)
    .call();
  vehicle.injected.price = price
  vehicle.injected.display_price = await weiToMyCurrency(price)
}


async function getVehiclesForAccount(account) {

  let accountBalance = await getAccountBalance(account)
  let myVehicles = []
  for (var i = 0; i < accountBalance; i++) {
    let vehicleID = await getVehicleOfOwnerByIndex(account, i)
    let vehicleURI = await getVehicleURI(vehicleID)
    let vehicleMetadata = await getVehicleMetadata(vehicleURI)
    injectTokenId(vehicleMetadata, vehicleID)
    if (await getIfForSale(vehicleID)) {
      await injectPrice(vehicleMetadata)
      if (await getIfAuction(vehicleID))
        if (await getTopBidder(vehicleID) == await getUserAccount())
          vehicleMetadata.injected.bid = true
    }
    myVehicles.push(vehicleMetadata)
  }

  console.log("pulled my vehicles", myVehicles)
  return myVehicles
}



async function getAllVehicles() {

  let totalNrOfVehicles = await getTotalNrOfVehicles()
  let allVehicles = []
  for (var i = 0; i < totalNrOfVehicles; i++) {

    let vehicleID = await getVehicleByIndex(i)
    let vehicleURI = await getVehicleURI(vehicleID)
    let vehicleMetadata = await getVehicleMetadata(vehicleURI)

    injectTokenId(vehicleMetadata, vehicleID)
    if (await getIfForSale(vehicleID)) {
      await injectPrice(vehicleMetadata)
      if (await getIfAuction(vehicleID)) {
        vehicleMetadata.injected.auction = true
        if (await getTopBidder(vehicleID) == await store.getState().blockchain.account)
          vehicleMetadata.injected.bid = true
      }
    }
    allVehicles.push(vehicleMetadata)
  }


  console.log("pulled all vehicles", allVehicles)
  return allVehicles
}


async function getMyBids(allVehicles) {
  let onlyMyBids = []
  for (var i = 0; i < allVehicles.length; i++) {
    if (allVehicles[i].injected.hasOwnProperty('bid'))
      onlyMyBids = [...onlyMyBids, allVehicles[i]]
  }
  return onlyMyBids
}

async function getForSaleVehicles(allVehicles) {

  let onlyVehiclesForSale = { instant: [], auctions: [] }
  for (var i = 0; i < allVehicles.length; i++) {
    if (allVehicles[i].injected.hasOwnProperty('price')) {
      if (allVehicles[i].injected.hasOwnProperty('auction'))
        onlyVehiclesForSale.auctions.push(allVehicles[i])
      else
        onlyVehiclesForSale.instant.push(allVehicles[i])
    }
  }
  console.log("forsale", onlyVehiclesForSale)
  return onlyVehiclesForSale
}


export const fetchMyData = () => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {

      const account = await getUserAccount()
      const myRole = await getRole(account)

      if (viewAllPrivileged.some(privilegedRole => privilegedRole === myRole)) {
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
      dispatch(fetchDataFailed(err));
    }
  };
};



export const refresh = (code) => {
  return async (dispatch) => {
    dispatch(fetchDataRequest()); 
    try {
      switch (code) {
        case "MY_VEHICLES":
          dispatch(
            updateState({
              field: "myVehicles",
              value: await getVehiclesForAccount(await getUserAccount())
            })
          );
          break;
        case "SALE_VEHICLES":
          dispatch(
            updateState({
              field: "vehiclesForSale",
              value: await getForSaleVehicles(await getAllVehicles())
            })
          );
          break;
        case "ALL_VEHICLES":
          dispatch(
            updateState({
              field: "allVehicles",
              value: await getAllVehicles()
            })
          );
          break;
        case "ROLE":
          dispatch(
            updateState({
              field: "myRole",
              value: await getRole(await getUserAccount())
            })
          );
          break;
        case "BIDS":
          dispatch(
            updateState({
              field: "myBids",
              value: await getMyBids(await getAllVehicles())
            })
          );
          break;
      }
    } catch (err) {
      dispatch(fetchDataFailed(err));
    }
  };
}


export const updatePrefferedCurrency = (e) => {
  return async (dispatch) => {
    const { value } = e.target
    dispatch(
      updateState({
        field: "displayCurrency",
        value: value
      })
    );
  };
};


export const refreshDisplayPrices = () => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      let forsale = await store
        .getState()
        .data.vehiclesForSale

      for (const element in forsale.auctions) {
        forsale.auctions[element].injected.display_price = await weiToMyCurrency(forsale.auctions[element].injected.price)
      }
      for (const element in forsale.instant) {
        forsale.instant[element].injected.display_price = await weiToMyCurrency(forsale.instant[element].injected.price)
      }

      dispatch(
        updateState({
          field: "vehiclesForSale",
          value: forsale
        })
      );
    } catch (err) {
      dispatch(fetchDataFailed(err));
    }
  };
}