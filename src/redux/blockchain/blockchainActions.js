
import Web3 from "web3";
import ExternalGatewayContract from "../../abis/ExternalGateway.json";
import { fetchMyData, refresh } from "../data/dataActions";
import detectEthereumProvider from '@metamask/detect-provider';
import store from "../store";
import { ALL_TEMPLATES } from "../../components/utils/NetworkTemplates";
import MetaMaskOnboarding from '@metamask/onboarding';

const updateState = (payload) => {
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
      await dispatch(updateState({ field: "initFinished", value: true }))
      await dispatch(updateState({ field: "availableNetworks", value: getDeployedChains(ExternalGatewayContract) }))
      await dispatch(updateAppNetwork("0x3"))
    }
    catch (err) {
      dispatch(updateState({ field: "errorMsg", value: err.message }))
    }
    dispatch(loading())
  }
}

export const login = () => {
  return async (dispatch) => {
    dispatch(loading("Login"))
    try {

      const provider = await fetchProvider()
      const account = await fetchAccounts(provider)
      const network = await fetchChain(provider)

      await dispatch(updateWalletProvider(provider))
      await dispatch(updateWeb3Provider(provider))
      await dispatch(updateAppAccount(account));
      await dispatch(updateAppNetwork(network))

    } catch (err) {
      dispatch(updateState({ field: "errorMsg", value: err.message }))
    }
    dispatch(loading())
  }
}


const fetchProvider = async () => {
  const provider = await detectEthereumProvider({ timeout: 5 })
  if (!provider) {
    new MetaMaskOnboarding().startOnboarding();
    throw Error("No WEB3 provider detected. Please install a WEB3 wallet such as MetaMask.")
  }
  return provider
}

const fetchAccounts = async (provider) => {
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


export const addChain = async (newNetwork) => {

  
  
    await (await getProvider()).request({
      method: 'wallet_addEthereumChain',
      params: [ALL_TEMPLATES[newNetwork]]
    });
}


export const updateWalletProvider = (wallet) => {
  return async (dispatch) => {
    dispatch(updateState({ field: "provider", value: wallet }))
  }
}

export const updateWeb3Provider = (provider) => {
  return async (dispatch) => {
    dispatch(updateState({ field: "web3", value: new Web3(provider) }))
  }
}

export const updateAppNetwork = (newNetwork) => {
  return async (dispatch) => {
    const availableNetworks = await getAvailableNetworks()
    console.log(newNetwork,availableNetworks)
    if (!(newNetwork in availableNetworks))
      await addChain(Object.keys(availableNetworks)[0])
    else
      dispatch(updateState({ field: "currentNetwork", value: newNetwork }))
  };
};

export const updateAppAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateState({ field: "account", value: Web3.utils.toChecksumAddress(account) }));
  };
};


const getProvider = async () => {
  return await store.getState().blockchain.provider
}

const getAvailableNetworks = async () => {
  return await store.getState().blockchain.availableNetworks
}

const getCurrentNetwork = async () => {
  return await store.getState().blockchain.currentNetwork
}
