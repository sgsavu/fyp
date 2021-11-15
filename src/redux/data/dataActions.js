// log
import { roles } from "../../pages/PermissionsAndRoles";
import store from "../store";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};


async function requestMetadata(URIS) {

  let fetchedVehicles = []
  for (const URI of URIS) {
    await fetch(URI)
      .then((response) => response.json())
      .then((vehicleMetadata) => {
        fetchedVehicles = [...fetchedVehicles, vehicleMetadata]
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return fetchedVehicles
}

async function getTokenURI(token) {
  return await store
    .getState()
    .blockchain.smartContract.methods
    .tokenURI(token)
    .call();
}

async function tokenByIndex(index) {
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

async function getAccountVehicleIDs(nrOfVehicles, account) {

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
    let vehicleURI = await getTokenURI(vehicleIDS[i])
    accountVehicleMetadata = [...accountVehicleMetadata, vehicleURI]
  }
  return accountVehicleMetadata
}

async function getVehiclesForAccount(account) {
  let accountBalance = await getAccountBalance(account)
  let accountVehicleIDs = await getAccountVehicleIDs(accountBalance, account)
  let accountVehicleURIS = await getVehicleURIS(accountVehicleIDs)
  let myVehicles = await requestMetadata(accountVehicleURIS)
  return myVehicles
}

async function getVehiclesForSale() {
  let vehiclesForSaleIds = await store
    .getState()
    .blockchain.smartContract.methods.getTokensForSale()
    .call();
  let vehiclesForSaleURIs = await getVehicleURIS(vehiclesForSaleIds)
  let vehiclesForSale = await requestMetadata(vehiclesForSaleURIs)
  return vehiclesForSale
}

async function getAllTokensIDs(length) {
  let allVehiclesIds = []
  for (var i = 0; i < length; i++) {
    let vehicleId = await tokenByIndex(i)
    allVehiclesIds = [...allVehiclesIds, vehicleId]
  }
  return allVehiclesIds
}

async function getAllVehicles() {

  let totalNrOfVehicles = await store
    .getState()
    .blockchain.smartContract.methods.totalSupply()
    .call();

  let allVehiclesIds = await getAllTokensIDs(totalNrOfVehicles)
  let allVehiclesURIs = await getVehicleURIS(allVehiclesIds)
  let allVehicles = await requestMetadata(allVehiclesURIs)
  return allVehicles
}

export const fetchData = (account) => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {


      let myRole = await getRole(account)
      let myVehicles = await getVehiclesForAccount(account)
      let vehiclesForSale = await getVehiclesForSale()
      let allVehicles = await getAllVehicles()

      dispatch(
        fetchDataSuccess({
          myRole,
          myVehicles,
          vehiclesForSale,
          allVehicles
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
