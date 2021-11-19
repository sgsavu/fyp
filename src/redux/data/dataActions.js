// log
import { roles } from "../../pages/PermissionsAndRoles";
import store from "../store";

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

const fetchDataFailed = (payload) => {
  return {
    type: "FETCH_DATA_FAILED",
    payload: payload,
  };
};

const accountUpdateFavCurrency = (payload) => {
  return {
    type: "UPDATE_FAV_CURRENCY",
    payload: payload,
  };
};

async function getVehiclesMetadata(vehicleURIS) {

  let fetchedVehicles = []
  function resultCallback(result){
    fetchedVehicles.push(result)
  }
  for (const vehicleURI of vehicleURIS) {
    await getVehicleMetadata(vehicleURI,resultCallback)
  }
  return fetchedVehicles
}

async function getVehicleMetadata(URI,callback) {
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

async function getTotalNrOfVehicles(){
  return await store
    .getState()
    .blockchain.smartContract.methods.totalSupply()
    .call();
}

async function injectTokenId(vehicleIDsList,vehicleObjectsList){
  for (let i = 0; i < vehicleObjectsList.length; i++) {
    vehicleObjectsList[i].injected = {}
    vehicleObjectsList[i].injected.id = vehicleIDsList[i]
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
  injectTokenId(accountVehicleIDs,myVehicles)
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

async function getVehiclesForSale() {

  let totalNrOfVehicles = await getTotalNrOfVehicles()
  let allVehiclesIds = await getAllVehicleIDs(totalNrOfVehicles)
  let vehiclesForSaleIds = []
  for (var i = 0; i < allVehiclesIds.length; i++) {
    if (await isForSale(allVehiclesIds[i]))
      vehiclesForSaleIds = [...vehiclesForSaleIds, allVehiclesIds[i]]
  }
  let vehiclesForSaleURIs = await getVehicleURIS(vehiclesForSaleIds)
  let vehiclesForSale = await getVehiclesMetadata(vehiclesForSaleURIs)
  injectTokenId(vehiclesForSaleIds,vehiclesForSale)
  return vehiclesForSale
}

async function getAllVehicles() {

  let totalNrOfVehicles = await getTotalNrOfVehicles()
  let allVehiclesIds = await getAllVehicleIDs(totalNrOfVehicles)
  let allVehiclesURIs = await getVehicleURIS(allVehiclesIds)
  let allVehicles = await getVehiclesMetadata(allVehiclesURIs)
  injectTokenId(allVehiclesIds,allVehicles)
  return allVehicles
}

export const fetchData = (account) => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      let myRole = await getRole(account)
      let myVehicles = await getVehiclesForAccount(account)
      let allVehicles = await getAllVehicles()
      let vehiclesForSale = await getVehiclesForSale()
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

export const updatePrefferedCurrency = (e) => {
  return async (dispatch) => {
    e.preventDefault();
    const { value } = e.target
    dispatch(
      accountUpdateFavCurrency(value)
    );
  };
};
