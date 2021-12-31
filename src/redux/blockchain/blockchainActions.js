
import Web3 from "web3";
import ExternalGatewayContract from "../../abis/ExternalGateway.json";
import { fetchMyData, refresh } from "../data/dataActions";
import detectEthereumProvider from '@metamask/detect-provider';
import store from "../store";
import { ALL_TEMPLATES, METAMASK_DEFAULT } from "../../components/utils/NetworkTemplates";
import MetaMaskOnboarding from '@metamask/onboarding';
import { alerts } from "../app/appActions";

export const updateState = (payload) => {
  return {
    type: "UPDATE_STATE",
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
    dispatch(alerts("loading","Initializing"))
    try {
      await dispatch(updateState({ field: "initFinished", value: true }))
      await dispatch(updateState({ field: "availableNetworks", value: getDeployedChains(ExternalGatewayContract) }))
      await dispatch(updateAppNetwork("0x3"))
    }
    catch (err) {
      dispatch(alerts("error",err.message))
    }
    dispatch(alerts("loading"))
  }
}

export const login = () => {
  return async (dispatch) => {
    try {
      const provider = await fetchProvider()
      const account = await fetchAccounts(provider)
      const network = await fetchChain(provider)
      await dispatch(updateWalletProvider(provider))
      await dispatch(updateWeb3Provider(provider))
      await dispatch(updateAppNetwork(network))
      await dispatch(updateAppAccount(account));

    } catch (err) {
      dispatch(alerts("error",err.message))
    }
  }
}


export const fetchProvider = async () => {
  const provider = await detectEthereumProvider({ timeout: 5 })
  if (!provider) {
    new MetaMaskOnboarding().startOnboarding();
    throw Error("No WEB3 provider detected. Please install a WEB3 wallet such as MetaMask.")
  }
  return provider
}

export const fetchAccounts = async (provider) => {
  const accounts = await provider.request({
    method: "eth_requestAccounts",
  });
  if (accounts.length == 0)
    throw Error("No account in list.")
  return accounts[0]
}

const fetchChain = async (provider) => {
  return await provider.request({
    method: "eth_chainId",
  });
}

const addChain = async (newNetwork) => {

  (await getProvider()).request({
    method: 'wallet_addEthereumChain',
    params: [ALL_TEMPLATES[newNetwork]]
  });
}

const switchChain = async (newNetwork) => {

  (await getProvider()).request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: newNetwork }]
  });
}


export const loadSmartContract = () => {
  return async (dispatch) => {

    dispatch(alerts("loading","Fetching smart contract for new network."))
    try {
      const web3 = await getWeb3()
      const currentNetwork = await getCurrentNetwork()
      const availableNetworks = await getAvailableNetworks()
      const SmartContractObj = new web3.eth.Contract(
        ExternalGatewayContract.abi,
        availableNetworks[currentNetwork]
      );
      dispatch(updateState({ field: "smartContract", value: SmartContractObj }))
    }
    catch (err) {
      dispatch(alerts("error",err.message))
    }
    dispatch(alerts("loading"))
  }
}


export const updateWalletProvider = (wallet) => {
  return async (dispatch) => {
    dispatch(updateState({ field: "walletProvider", value: wallet }))
  }
}

export const updateWeb3Provider = (provider) => {
  return async (dispatch) => {
    dispatch(updateState({ field: "web3", value: new Web3(provider) }))
  }
}

export const addOrSwitchNetwork  = async (newNetwork) => {
    if (newNetwork in METAMASK_DEFAULT)
      await switchChain(newNetwork)
    else
      await addChain(newNetwork)  
}

export const updateAppNetwork = (newNetwork) => {
  return async (dispatch) => {
    try{
      const availableNetworks = await getAvailableNetworks()
    if (!(newNetwork in availableNetworks))
      await addOrSwitchNetwork(Object.keys(availableNetworks)[0])
    else
      dispatch(updateState({ field: "currentNetwork", value: newNetwork }))
    }
    catch(err) {
      dispatch(alerts("error",err.message))
    }
  };
};

export const updateAppAccount = (account) => {
  return async (dispatch) => {
    if (account)
      account = Web3.utils.toChecksumAddress(account)
    dispatch(updateState({ field: "account", value: account }));
  };
};

const getWeb3 = async () => {
  return await store.getState().blockchain.web3
}

const getProvider = async () => {
  return await store.getState().blockchain.walletProvider
}

const getAvailableNetworks = async () => {
  return await store.getState().blockchain.availableNetworks
}

const getCurrentNetwork = async () => {
  return await store.getState().blockchain.currentNetwork
}
