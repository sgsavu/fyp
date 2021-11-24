import Web3 from "web3";
import VehicleContract from "../../abis/Vehicle.json";
import ExternalGatewayContract from "../../abis/ExternalGateway.json";
import { fetchAllData } from "../data/dataActions";
import store from "../store";

const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

const connectSuccess = (payload) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

const updateAccountRequest = (payload) => {
  return {
    type: "UPDATE_ACCOUNT",
    payload: payload,
  };
};



export const connect = () => {
  return async (dispatch) => {
    dispatch(connectRequest());
    if (window.ethereum) {
      let web3 = new Web3(window.ethereum);
      


      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        const networkId = await window.ethereum.request({
          method: "net_version",
        });
        const NetworkData = await ExternalGatewayContract.networks[networkId];
        if (NetworkData) {
          const SmartContractObj = new web3.eth.Contract(
            ExternalGatewayContract.abi,
            NetworkData.address
          );
          dispatch(
            connectSuccess({
              account: Web3.utils.toChecksumAddress(accounts[0]),
              smartContract: SmartContractObj,
              web3: web3,
            })
          );
          
          window.ethereum.on("accountsChanged", (accounts) => {

            dispatch(updateAccount(Web3.utils.toChecksumAddress(accounts[0])));
          });
          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });
          
        } else {
          dispatch(connectFailed("Change network to localhost:xxxx."));
        }
      } catch (err) {
        dispatch(connectFailed("Something went wrong."));
      }
    } else {
      dispatch(connectFailed("Install Metamask."));
    }
  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: account }));
    dispatch(fetchAllData(account));
  };
};
