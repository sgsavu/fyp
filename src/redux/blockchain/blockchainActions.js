import Web3 from "web3";
import Gateway from "../../api/resources/Gateway.json";
import Vehicle from "../../api/resources/Vehicle.json";
import Roles from "../../api/resources/Roles.json";
import Odometer from "../../api/resources/Odometer.json";
import Management from "../../api/resources/Management.json";
import NetworkTables from "../../api/resources/NetworkTables.json";
import detectEthereumProvider from '@metamask/detect-provider';

import MetaMaskOnboarding from '@metamask/onboarding';
import { alerts, updateAppState, updateBlockchainState } from "../app/appActions";
import { clearMyData } from "../data/dataActions";
import { subscribeToApproval, subscribeToNewGarageApproval, subscribeToNewPrice, subscribeToNewTopBidder, subscribeToSaleStatus, subscribeToTransfers } from "./eventSubscriber";
import { getCurrentNetwork, getNetworkTables, getWalletProvider, getWeb3 } from "../reduxUtils";
import { getNetworkRpcUrl } from "../../components/utils/GatewayParser";

const CONTRACT_LIST = [Gateway, Vehicle, Roles, Odometer, Management]
const fetchWalletProvider = async () => {
  const provider = await detectEthereumProvider({ timeout: 5 })
  if (!provider) {
    new MetaMaskOnboarding().startOnboarding();
    throw Error("No WEB3 provider detected. Please install a WEB3 wallet such as MetaMask.")
  }
  return provider
}

const fetchWalletAccounts = async (provider) => {
  const accounts = await provider.request({
    method: "eth_requestAccounts",
  });
  if (accounts.length == 0)
    throw Error("No account in list.")
  return accounts[0]
}

const fetchWalletChain = async (provider) => {
  return await provider.request({
    method: "eth_chainId",
  });
}

const addChain = async (newNetwork) => {

  (await getWalletProvider()).request({
    method: 'wallet_addEthereumChain',
    params: [NetworkTables.networks[newNetwork]]
  });
}

const switchChain = async (newNetwork) => {

  (await getWalletProvider()).request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: newNetwork }]
  });
}

export const addOrSwitchNetwork = async (newNetwork) => {
  if (["0x4","0x3","0x1"].includes(newNetwork))
    await switchChain(newNetwork)
  else
    await addChain(newNetwork)
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
      const networkTables = await getNetworkTables()
      if (!(newNetwork in networkTables.networks))
        await addOrSwitchNetwork(Object.keys(networkTables.networks)[0])
      else
        dispatch(updateBlockchainState({ field: "currentNetwork", value: newNetwork }))
    }
    catch (err) {
      dispatch(alerts({ alert: "error", message: err.message }))
    }
  };
};



export const init = () => {
  return async (dispatch) => {
    try {
      await dispatch(updateAppState({ field: "initializedApp", value: true }))
      await dispatch(updateBlockchainState({ field: "networkTables", value: NetworkTables }))
      await dispatch(updateAppNetwork(Object.keys(NetworkTables.networks)[0]))
    }
    catch (err) {
      dispatch(alerts({ alert: "error", message: err.message }))
    }
  }
}

export const login = () => {
  return async (dispatch) => {
    try {
      const provider = await fetchWalletProvider()
      const account = await fetchWalletAccounts(provider)
      const network = await fetchWalletChain(provider)
      await dispatch(updateWalletProvider(provider))
      await dispatch(updateWeb3(provider))
      await dispatch(updateAppAccount(account));
      if (network == await getCurrentNetwork())
        await dispatch(loadSmartContracts())
      else
        await dispatch(updateAppNetwork(network))
    } catch (err) {
      dispatch(alerts({ alert: "error", message: err.message }))
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
      dispatch(alerts({ alert: "error", message: err.message }))
    }
  }
}

async function loadSmartContract(contract, chain) {
  const web3 = await getWeb3()
  const sc = new web3.eth.Contract(
    contract.abi,
    contract.networks[Web3.utils.hexToNumber(chain)]["address"]
  );
  return sc
}

export const loadSmartContracts = () => {
  return async (dispatch) => {

    try {

      const currentNetwork = await getCurrentNetwork()

      if (!(await getWalletProvider())) {
        await dispatch(updateWeb3(await getNetworkRpcUrl(currentNetwork)))
      }

      var smartContractList = []
      for (var i = 0; i < CONTRACT_LIST.length; i++) {
        smartContractList.push(await loadSmartContract(CONTRACT_LIST[i], currentNetwork))
      }

      console.log(smartContractList)

      await dispatch(updateBlockchainState({ field: "smartContracts", value: smartContractList }))

      dispatch(subscribeToChainEvents())

    }
    catch (err) {
      dispatch(alerts({ alert: "error", message: err.message }))
    }
  }
}

const subscribeToChainEvents = () => {
  return async (dispatch) => {
    dispatch(subscribeToTransfers())
    dispatch(subscribeToSaleStatus())
    dispatch(subscribeToNewPrice())
    dispatch(subscribeToNewTopBidder())
    dispatch(subscribeToNewGarageApproval())
    dispatch(subscribeToApproval())
  }
}
