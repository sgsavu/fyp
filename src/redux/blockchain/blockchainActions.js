import Web3 from "web3";
import ExternalGatewayContract from "../../abis/ExternalGateway.json";
import detectEthereumProvider from '@metamask/detect-provider';
import store from "../store";
import { ALL_TEMPLATES, getNetworkRpcUrl, METAMASK_DEFAULT } from "../../components/utils/NetworkTemplates";
import MetaMaskOnboarding from '@metamask/onboarding';
import { alerts, updateAppState, updateBlockchainState, updateDataState } from "../app/appActions";
import { clearMyData, fetchMyData } from "../data/dataActions";
import { roles } from "../../components/utils/PermissionsAndRoles";


const getDeployedChains = (contract) => {
  const deployed = {}
  for (var property in contract.networks)
    deployed[Web3.utils.numberToHex(property)] = contract.networks[property].address
  return deployed
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


export const initApp = () => {
  return async (dispatch) => {
    dispatch(alerts("loading", "Initializing"))
    try {
      await dispatch(updateAppState({ field: "initializedApp", value: true }))
      await dispatch(updateBlockchainState({ field: "availableNetworks", value: getDeployedChains(ExternalGatewayContract) }))
      await dispatch(updateAppNetwork("0x3"))
    }
    catch (err) {
      dispatch(alerts("error", err.message))
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
      await dispatch(updateWeb3(provider))
      await dispatch(updateAppAccount(account));
      if (network == await getCurrentNetwork())
        await dispatch(loadSmartContract())
      else
        await dispatch(updateAppNetwork(network))

    } catch (err) {
      dispatch(alerts("error", err.message))
    }
  }
}

export const signout = () => {
  return async (dispatch) => {
    try {
      dispatch(updateWalletProvider(null))
      dispatch(updateAppAccount(null));
      dispatch(clearMyData())
    } catch (err) {
      dispatch(alerts("error", err.message))
    }
  }
}

export const loadSmartContract = () => {
  return async (dispatch) => {

    dispatch(alerts("loading", "Fetching smart contract for new network."))
    try {
      const currentNetwork = await getCurrentNetwork()
      if (!(await store.getState().blockchain.walletProvider)) {
        await dispatch(updateWeb3(getNetworkRpcUrl(currentNetwork)))
      }
      const web3 = await getWeb3()
      const availableNetworks = await getAvailableNetworks()
      const SmartContractObj = new web3.eth.Contract(
        ExternalGatewayContract.abi,
        availableNetworks[currentNetwork]
      );
      dispatch(updateBlockchainState({ field: "smartContract", value: SmartContractObj }))
    }
    catch (err) {
      dispatch(alerts("error", err.message))
    }
    dispatch(alerts("loading"))
  }
}

export const addOrSwitchNetwork = async (newNetwork) => {
  if (newNetwork in METAMASK_DEFAULT)
    await switchChain(newNetwork)
  else
    await addChain(newNetwork)
}

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

export const updateWalletProvider = (wallet) => {
  return async (dispatch) => {
    dispatch(updateBlockchainState({ field: "walletProvider", value: wallet }))
  }
}

export const updateWeb3 = (provider) => {
  return async (dispatch) => {
    dispatch(updateBlockchainState({ field: "web3", value: new Web3(provider) }))
  }
}

export const updateAppAccount = (account) => {
  return async (dispatch) => {
    if (account)
      account = Web3.utils.toChecksumAddress(account)
    dispatch(updateBlockchainState({ field: "account", value: account }));
  };
};

export const updateAppNetwork = (newNetwork) => {
  return async (dispatch) => {
    try {
      const availableNetworks = await getAvailableNetworks()
      if (!(newNetwork in availableNetworks))
        await addOrSwitchNetwork(Object.keys(availableNetworks)[0])
      else
        dispatch(updateBlockchainState({ field: "currentNetwork", value: newNetwork }))
    }
    catch (err) {
      dispatch(alerts("error", err.message))
    }
  };
};

