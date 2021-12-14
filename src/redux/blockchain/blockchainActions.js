
import Web3 from "web3";
import ExternalGatewayContract from "../../abis/ExternalGateway.json";
import { fetchMyData, refresh } from "../data/dataActions";
import detectEthereumProvider from '@metamask/detect-provider';
import store from "../store";
import { ALL_TEMPLATES } from "../../utils/NetworkTemplates";


export const updateState = (payload) => {
  return {
    type: "UPDATE_STATE",
    payload: payload,
  }
}

const loading = (payload) => {
  return {
    type: "LOADING",
    payload: payload,
  }
}

const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};


const getDeployedChains = (contract) => {
  const deployed = {}
  for (var property in contract.networks)
    deployed[Web3.utils.numberToHex(property)] = contract.networks[property].address
  return deployed
}

export const initApp = () => {
  return async (dispatch) => {
    try {
      dispatch(loading("Init"));

      const provider = await detectEthereumProvider({ timeout: 5 });

      if (!provider)
        throw Error("No web3 provider detected. Please install a web3 wallet such as MetaMask.")

      const web3 = new Web3(provider)
      const availableNetworks = getDeployedChains(ExternalGatewayContract)

      dispatch(updateState({ field: "web3", value: web3 }))
      dispatch(updateState({ field: "provider", value: provider }))
      dispatch(updateState({ field: "availableNetworks", value: availableNetworks }))

      if (!provider._metamask.isUnlocked())
        throw Error("Wallet is locked. Please unlock.")

      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });

      const walletChainId = await provider.request({
        method: "eth_chainId",
      });

      if (!(walletChainId in availableNetworks))
        await addChain("0x13881")
      else
        dispatch(updateAppNetwork(walletChainId))

      dispatch(
        updateState({
          field: "account", value: Web3.utils.toChecksumAddress(accounts[0])
        })
      );

      dispatch(loading());

    } catch (err) {
      dispatch(connectFailed(err.message))
    }
  }
}


export const loadSmartContract = () => {
  return async (dispatch) => {

    try {
      dispatch(loading("Smart Contract"));
      const web3 = await store.getState().blockchain.web3
      const currentNetwork = await store.getState().blockchain.currentNetwork
      const availableNetworks = await store.getState().blockchain.availableNetworks
      const SmartContractObj = new web3.eth.Contract(
        ExternalGatewayContract.abi,
        availableNetworks[currentNetwork]
      );
      dispatch(updateState({ field: "smartContract", value: SmartContractObj }))
      dispatch(loading());
    }
    catch (err) {
      dispatch(connectFailed(err.message))
    }
  }
}


export const addChain = async (newNetwork) => {
  const provider = await store.getState().blockchain.provider
  await provider.request({
    method: 'wallet_addEthereumChain',
    params: [ALL_TEMPLATES[newNetwork]]
  });
}

export const updateAppNetwork = (newNetwork) => {
  return async (dispatch) => {
    dispatch(loading("UpdateNEtworkj"));
    dispatch(updateState({ field: "currentNetwork", value: newNetwork }))
    dispatch(loading());
  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateState({ field: "account", value: Web3.utils.toChecksumAddress(account) }));
    dispatch(fetchMyData())
  };
};
