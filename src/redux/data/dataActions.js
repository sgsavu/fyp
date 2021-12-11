// log
import { roles, viewAllPrivileged } from "../../utils/PermissionsAndRoles";
import { weiToMyCurrency } from "../../utils/PricesCoinsExchange";
import store from "../store";
import dataReducer from "./dataReducer";
import { getAccountBalance, getVehicleOfOwnerByIndex, getVehicleURI, getVehicleMetadata, getIfForSale, getIfAuction, getTopBidder, getTopBid, getTotalNrOfVehicles, getVehicleByIndex, getRole, getUserAccount } from "../../utils/BlockchainGateway";

const fetchDataRequest = () => {
  return {
    type: "FETCH_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "FETCH_DATA_SUCCESS",
    payload: payload,
  };
};

const updateMyBids = (payload) => {
  return {
    type: "UPDATE_MY_BIDS",
    payload: payload,
  };
};

const updateRole = (payload) => {
  return {
    type: "UPDATE_ROLE",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "FETCH_DATA_FAILED",
    payload: payload,
  };
};

const updateAllVehicles = (payload) => {
  return {
    type: "UPDATE_ALL_VEHICLES",
    payload: payload,
  };
};

const updateVehiclesForSale = (payload) => {
  return {
    type: "UPDATE_VEHICLES_FOR_SALE",
    payload: payload,
  };
};

const updateMyVehicles = (payload) => {
  return {
    type: "UPDATE_MY_VEHICLES",
    payload: payload,
  };
};

const updateDisplayCurrency = (payload) => {
  return {
    type: "UPDATE_DISPLAY_CURRENCY",
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
      injectPrice(vehicleMetadata)
      if (await getIfAuction(vehicleID))
        if (await getTopBidder(vehicleID) == await store.getState().blockchain.account)
          vehicleMetadata.injected.bid = true
    }
    myVehicles.push(vehicleMetadata)
  }

  console.log("pull in my vehicles", myVehicles)
  return myVehicles
}



async function getAllVehicles() {

  console.log("aye")
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


  console.log("pull in all vehicles", allVehicles)
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


export const fetchAllData = () => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {

      const account = await getUserAccount()
      const myRole = await getRole(account)

      if (viewAllPrivileged.some(privilegedRole => privilegedRole === myRole)) {
        dispatch(refresh("MY_VEHICLES"));
        dispatch(refresh("ALL_VEHICLES"));
        dispatch(refresh("FORSALE_VEHICLES"));
      }
      else {
        dispatch(refresh("MY_VEHICLES"));
        dispatch(refresh("FORSALE_VEHICLES"));
      }

      dispatch(refresh("ROLE"));
      dispatch(refresh("BIDS"));

    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
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
            updateMyVehicles(
              await getVehiclesForAccount(await store
                .getState()
                .blockchain.account)
            )
          );
          break;
        case "FORSALE_VEHICLES":
          console.log("aye")
          dispatch(
            updateVehiclesForSale(
              await getForSaleVehicles(await getAllVehicles())
            )
          );
          break;
        case "ALL_VEHICLES":
          dispatch(
            updateAllVehicles(
              await getAllVehicles()
            )
          );
          break;
        case "ROLE":
          dispatch(
            updateRole(
              await getRole(await store
                .getState()
                .blockchain.account)
            )
          );
          break;
        case "BIDS":
          dispatch(
            updateMyBids(
              await getMyBids(await getAllVehicles())
            )
          );
          break;


      }
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
}


export const updatePrefferedCurrency = (e) => {
  return async (dispatch) => {
    e.preventDefault();
    const { value } = e.target
    dispatch(
      updateDisplayCurrency(value)
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
        updateVehiclesForSale(
          forsale
        )
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
}