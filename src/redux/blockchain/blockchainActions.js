
import Web3 from "web3";
import ExternalGatewayContract from "../../abis/ExternalGateway.json";
import { fetchMyData, refresh } from "../data/dataActions";
import detectEthereumProvider from '@metamask/detect-provider';
import store from "../store";
import { ALL_TEMPLATES } from "../../components/utils/NetworkTemplates";
import MetaMaskOnboarding from '@metamask/onboarding';

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

const getDeployedChains = (contract) => {
  const deployed = {}
  for (var property in contract.networks)
    deployed[Web3.utils.numberToHex(property)] = contract.networks[property].address
  return deployed
}

export const initApp = () => {
  return async (dispatch) => {

    dispatch(loading("Initialization"))
    try {
      await dispatch(detectProvider())
      await dispatch(login())
      await dispatch(synchronizeChains())
    }
    catch (err) {
      dispatch(updateState({ field: "errorMsg", value: err.message }))
    }
    dispatch(loading())
  }
}

const detectProvider = () => {
  return async (dispatch) => {
    dispatch(loading("Detecting Provider"));
    const provider = await detectEthereumProvider({ timeout: 5 })
    if (!provider)
    { 
      new MetaMaskOnboarding().startOnboarding();
      throw Error("No WEB3 provider detected. Please install a WEB3 wallet such as MetaMask.")
    }
    dispatch(updateState({ field: "web3", value: new Web3(provider) }))
    dispatch(updateState({ field: "provider", value: provider }))
    dispatch(updateState({ field: "availableNetworks", value: getDeployedChains(ExternalGatewayContract) }))
    dispatch(loading());
  }
}

const login = () => {
  return async (dispatch) => {
    dispatch(loading("Connecting Wallet"));
    const accounts = await (await getProvider()).request({
      method: "eth_requestAccounts",
    });
    dispatch(updateState({ field: "account", value: Web3.utils.toChecksumAddress(accounts[0]) }));
    dispatch(loading());
  }
}

const synchronizeChains = () => {
  return async (dispatch) => {
    dispatch(loading("Synchronizing Chains"));
    const availableNetworks = await getAvailableNetworks()
    const walletChainId = await (await getProvider()).request({
      method: "eth_chainId",
    });
    if (!(walletChainId in availableNetworks))
      await addChain("0x13881")
    else
      dispatch(updateAppNetwork(walletChainId))
    dispatch(loading());
  }
}

export const addChain = async (newNetwork) => {
  await (await getProvider()).request({
    method: 'wallet_addEthereumChain',
    params: [ALL_TEMPLATES[newNetwork]]
  });
}

export const updateAppNetwork = (newNetwork) => {
  return async (dispatch) => {
    dispatch(updateState({ field: "currentNetwork", value: newNetwork }))
  };
};

export const updateAppAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateState({ field: "account", value: Web3.utils.toChecksumAddress(account) }));
    dispatch(fetchMyData())
  };
};


export const loadSmartContract = () => {
  return async (dispatch) => {

    dispatch(loading("Fetching smart contract for new network."));
    try {
      const web3 = await store.getState().blockchain.web3
      const currentNetwork = await store.getState().blockchain.currentNetwork
      const availableNetworks = await store.getState().blockchain.availableNetworks
      const SmartContractObj = new web3.eth.Contract(
        ExternalGatewayContract.abi,
        availableNetworks[currentNetwork]
      );
      dispatch(updateState({ field: "smartContract", value: SmartContractObj }))
    }
    catch (err) {
      dispatch(updateState({ field: "errorMsg", value: err.message }))
    }
    dispatch(loading());
  }
}

 const getProvider = async () => {
  return await store.getState().blockchain.provider
}

 const getAvailableNetworks = async () => {
  return await store.getState().blockchain.availableNetworks
}

 const getCurrentNetwork = async () => {
  return await store.getState().blockchain.currentNetwork
}
