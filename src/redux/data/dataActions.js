// log
import { roles, viewAllPrivileged } from "../../pages/PermissionsAndRoles";
import { convertToDisplayCurrency } from "../../pages/PricesCoinsExchange";
import store from "../store";
import dataReducer from "./dataReducer";

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

async function getVehiclesMetadata(vehicleURIS) {

  let fetchedVehicles = []
  function resultCallback(result) {
    fetchedVehicles.push(result)
  }
  for (const vehicleURI of vehicleURIS) {
    await getVehicleMetadata(vehicleURI, resultCallback)
  }
  return fetchedVehicles
}

async function getVehicleMetadata(URI, callback) {
  await fetch(URI)
    .then((response) => response.json())
    .then((vehicleMetadata) => {
      callback(vehicleMetadata)
    })
    .catch((err) => {
      console.log(err);
    });
}

async function getVehicleURI(vehicleID) {
  return await store
    .getState()
    .blockchain.smartContract.methods
    .tokenURI(vehicleID)
    .call();
}

async function getVehicleByIndex(index) {
  return await store
    .getState()
    .blockchain.smartContract.methods
    .tokenByIndex(index)
    .call();
}

async function getRole(account) {

  for (const role in roles) {
    if (
      await store
        .getState()
        .blockchain.smartContract.methods
        .hasRole(roles[role], account)
        .call()
    )
      return roles[role]
  }
  return roles.USER_ROLE
}

async function getAccountBalance(account) {
  return await store
    .getState()
    .blockchain.smartContract.methods.balanceOf(account)
    .call();
}

async function isForSale(vehicle) {
  return await store
    .getState()
    .blockchain.smartContract.methods.isForSale(vehicle)
    .call();
}

async function getTotalNrOfVehicles() {
  return await store
    .getState()
    .blockchain.smartContract.methods.totalSupply()
    .call();
}

async function getBid(id,account) {
  return await store
    .getState()
    .blockchain.smartContract.methods.getBid(id,account)
    .call();
}

async function injectTokenId(vehicleIDsList, vehicleObjectsList) {
  for (let i = 0; i < vehicleObjectsList.length; i++) {
    vehicleObjectsList[i].injected = {}
    vehicleObjectsList[i].injected.id = vehicleIDsList[i]
  }
}

async function injectPrice(vehicleObjectsList) {
  for (let i = 0; i < vehicleObjectsList.length; i++) {
    let price = await store
      .getState()
      .blockchain.smartContract.methods.getVehiclePrice(vehicleObjectsList[i].injected.id)
      .call();
    vehicleObjectsList[i].injected.price = price
    vehicleObjectsList[i].injected.display_price = await convertToDisplayCurrency(price)
  }
}



async function getVehicleIDsForAccount(nrOfVehicles, account) {

  let accountVehicleIDs = []
  for (var i = 0; i < nrOfVehicles; i++) {
    let vehicleID = await store
      .getState()
      .blockchain.smartContract.methods
      .tokenOfOwnerByIndex(account, i)
      .call();
    accountVehicleIDs = [...accountVehicleIDs, vehicleID]
  }
  return accountVehicleIDs
}

async function getVehicleURIS(vehicleIDS) {

  let accountVehicleMetadata = []
  for (var i = 0; i < vehicleIDS.length; i++) {
    let vehicleURI = await getVehicleURI(vehicleIDS[i])
    accountVehicleMetadata = [...accountVehicleMetadata, vehicleURI]
  }
  return accountVehicleMetadata
}

async function getVehiclesForAccount(account) {
  let accountBalance = await getAccountBalance(account)

  let accountVehicleIDs = await getVehicleIDsForAccount(accountBalance, account)
  let accountVehicleURIS = await getVehicleURIS(accountVehicleIDs)
  let myVehicles = await getVehiclesMetadata(accountVehicleURIS)
  await injectTokenId(accountVehicleIDs, myVehicles)
  return myVehicles
}

async function getAllVehicleIDs(length) {
  let allVehiclesIds = []
  for (var i = 0; i < length; i++) {
    let vehicleId = await getVehicleByIndex(i)
    allVehiclesIds = [...allVehiclesIds, vehicleId]
  }
  return allVehiclesIds
}

async function getVehiclesForSale(allVehicles) {
  
  let onlyVehiclesForSale = []
  for (var i = 0; i < allVehicles.length; i++) {
    if (allVehicles[i].injected.hasOwnProperty('price'))
      onlyVehiclesForSale = [...onlyVehiclesForSale,allVehicles[i]]
  }
  return onlyVehiclesForSale
}

async function getAllVehicles() {

  let acc = await store
      .getState()
      .blockchain.account
  let totalNrOfVehicles = await getTotalNrOfVehicles()
  let allVehiclesIds = await getAllVehicleIDs(totalNrOfVehicles)
  let allVehiclesURIs = await getVehicleURIS(allVehiclesIds)
  let allVehicles = await getVehiclesMetadata(allVehiclesURIs)
  await injectTokenId(allVehiclesIds, allVehicles)
  for (var i = 0; i < allVehiclesIds.length; i++) {
    if (await isForSale(allVehiclesIds[i]))
      await injectPrice([allVehicles[i]])
    let bid = await getBid(i,acc)
    if (bid!=0)
      allVehicles[i].injected.bid = bid
  }
  console.log(allVehicles)
  return allVehicles
}


async function getMyBids(allVehicles) {
  
  let onlyMyBids = []
  for (var i = 0; i < allVehicles.length; i++) {
    if (allVehicles[i].injected.hasOwnProperty('bid'))
    onlyMyBids = [...onlyMyBids,allVehicles[i]]
  }

  return onlyMyBids
}


async function getPersistentBids() {
  
  let acc = await store
      .getState()
      .blockchain.account
  let totalNrOfVehicles = await getTotalNrOfVehicles()
  let deletedBids = []
  for (var i = 0; i < totalNrOfVehicles; i++) {
    let bid = await getBid(i,acc)
    if (bid!=0)
      deletedBids = [...deletedBids,{id: i, bid:bid}]
  
  }

  return deletedBids
}


export const fetchAllData = (account) => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {

      const myRole = await getRole(account)

      if (viewAllPrivileged.some(privilegedRole => privilegedRole === myRole)) {
        dispatch(refreshMyVehicles());
        dispatch(refreshAllVehicles());
        dispatch(refreshVehiclesForSale());
      }
      else {
        dispatch(refreshMyVehicles());
        dispatch(refreshVehiclesForSale());
      }

      dispatch(refreshRole());
      dispatch(refreshMyBids());

    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};

export const updatePrefferedCurrency = (e) => {
  return async (dispatch) => {
    e.preventDefault();
    const { value } = e.target
    dispatch(
      updateDisplayCurrency(value)
    );
  };
};

export const refreshMyBids = () => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {

  
      dispatch(
        updateMyBids(
          await getPersistentBids()
        )
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};

export const refreshRole = () => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {

      let account = await store
        .getState()
        .blockchain.account
      let role = await getRole(account)

      dispatch(
        updateRole(
          role
        )
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};

export const refreshAllVehicles = () => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      dispatch(
        updateAllVehicles(
          await getAllVehicles()
        )
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};

export const refreshVehiclesForSale = () => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      dispatch(
        updateVehiclesForSale(
          await getVehiclesForSale(await getAllVehicles())
        )
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};

export const refreshMyVehicles = () => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      dispatch(
        updateMyVehicles(
          await getVehiclesForAccount(await store
            .getState()
            .blockchain.account)
        )
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};

export const refreshDisplayPrices = () => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      let forsale = await store
        .getState()
        .data.vehiclesForSale
      for (const element in forsale) {
        forsale[element].injected.display_price = await convertToDisplayCurrency(forsale[element].injected.price)
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