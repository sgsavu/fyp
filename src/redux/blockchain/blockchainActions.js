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
import { subscribeToApproval, subscribeToEvent, subscribeToTransfers } from "./eventSubscriber";
import { getCurrentNetwork, getNetworkTables, getWalletProvider, getWeb3 } from "../reduxUtils";
import { getNetworkRpcUrl } from "../../components/utils/GatewayParser";

const CONTRACT_LIST = [Gateway, Vehicle, Roles, Odometer, Management]


/**
 * Function which detects the user's wallet provider in their browser.
 * In our instance if they do not have a browser wallet we start the
 * process of onboarding them by redirecting to metamask
 * @returns {Object} the wallet provider
 */
const fetchWalletProvider = async () => {
  const provider = await detectEthereumProvider({ timeout: 5 })
  if (!provider) {
    new MetaMaskOnboarding().startOnboarding();
    throw Error("No WEB3 provider detected. Please install a WEB3 wallet such as MetaMask.")
  }
  return provider
}


/**
 * Rpc request to fetch the user's addresses from their wallet
 * @param provider the user's wallet provider
 * @returns {List[Strings]} the chain as a String
 */
const fetchWalletAccounts = async (provider) => {
  const accounts = await provider.request({
    method: "eth_requestAccounts",
  });
  if (accounts.length == 0)
    throw Error("No account in list.")
  return accounts[0]
}

/**
 * Rpc request to fetch the user's current chain from their wallet
 * @param provider the user's wallet provider
 * @returns {String} the chain as a String
 */
const fetchWalletChain = async (provider) => {
  return await provider.request({
    method: "eth_chainId",
  });
}

/**
 * Metamask rpc request to add a newtork to the wallet's network list/book
 * It uses templates from the NetworkTables file to generate that new network in
 * the user's wallet.
 * @param newNetwork the network we wish to add to the user
 */
const addChain = async (newNetwork) => {
  (await getWalletProvider()).request({
    method: 'wallet_addEthereumChain',
    params: [NetworkTables.networks[newNetwork]]
  });
}

/**
 * Metamask rpc request to change the wallet's network to the one provided in the params
 * @param newNetwork the network we wish to switch the user to
 */
const switchChain = async (newNetwork) => {
  (await getWalletProvider()).request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: newNetwork }]
  });
}

/**
 * This function check if the newNetwork we are trying to switch to is in the ones that come as default
 * for metamask which are 0x4,0x3,0x1
 * If it does then simply switch to them. If not add the network to the user's wallet.
 * @param newNetwork the network we wish to switch to
 */
export const addOrSwitchNetwork = async (newNetwork) => {
  if (["0x4", "0x3", "0x1"].includes(newNetwork))
    await switchChain(newNetwork)
  else
    await addChain(newNetwork)
}

/**
 * Updates the redux store value of the app wallet provider used throught the entire application.
 * This could be providers such as: Metamask, Walletconnect, etc.
 * @param wallet browser extension wallet instance
 */
export const updateWalletProvider = (wallet) => {
  return async (dispatch) => {
    dispatch(updateBlockchainState({ field: "walletProvider", value: wallet }))
  }
}

/**
 * Updates the redux store value of the app web3 instance used throught the entire application.
 * @param provider this is the web3 instance we are trying to set as the app web3.
 */
export const updateWeb3 = (provider) => {
  return async (dispatch) => {
    dispatch(updateBlockchainState({ field: "web3", value: new Web3(provider) }))
  }
}

/**
 * Updates the redux store value of the app's main user account to the one provided in the params.
 * Also validates if the address provided is correct
 * @param account the account address we wish to set as the app account
 */
export const updateAppAccount = (account) => {
  return async (dispatch) => {
    if (account)
      account = Web3.utils.toChecksumAddress(account)
    dispatch(updateBlockchainState({ field: "account", value: account }));
  };
};

/**
 * Updates the redux store value of the app network used throught the entire application.
 * It first checks if the new network we are trying to switch to is in the networks the app
 * supports. If it is directly switch to it. If not switch the network to the first one the app supports.
 * @param newNetwork this is the network that we are trying to switch to.
 */
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


/**
 * Initialization function used to let the app know it is 
 * time to start rendering after everything has been mounted.
 * It pulls all the networks the app is deployed from the networkTables.json file
 * and sets the default app network to the first network in that file.
 */
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

/**
 * Aggregate function to login a user from a browser embedded wallet.
 * If the user is on the same network as the app is currently on just load
 * the smart contracts. Otherwise update the app network with the user's network.
 */
export const login = () => {
  return async (dispatch) => {
    try {
      const provider = await fetchWalletProvider()
      const account = await fetchWalletAccounts(provider)
      const network = await fetchWalletChain(provider)
      await dispatch(updateWalletProvider(provider))
      await dispatch(updateWeb3(provider))
      await dispatch(updateAppAccount(account));
      if (network == await getCurrentNetwork()) {
        //await dispatch(getAuthenticatedData())
        await dispatch(loadSmartContracts())
        //await dispatch(subscribeToChainEvents())
      }
      else {
        await dispatch(updateAppNetwork(network))
      }
    } catch (err) {
      dispatch(alerts({ alert: "error", message: err.message }))
    }
  }
}

/**
 * Aggregate function to sign a user out and garbage collect anything that was related
 * to the user while logged in.
 */
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

/**
 * It creates web3 smart contract objects using the web3js library by combining
 * the contract's abi and the contract's network address passed in from the parameters.
 * @param contract the json contract object aka. artifact
 * @param chain the chain for which we wish to create the smart contract object
 * @returns {Promise} a web3 smart contract object from the web3js library
 */
async function loadSmartContract(contract, chain) {
  const web3 = await getWeb3()
  const sc = new web3.eth.Contract(
    contract.abi,
    contract.networks[Web3.utils.hexToNumber(chain)]["address"]
  );
  return sc
}

/**
 * Aggregate function which creates a web3 smart contract object for all of the 
 * smart contracts in our smart contract list
 * Updates the redux store value of the smartContracts with the list it generates.
 * It subscribes the app to events on the newly created smartcontract list of contracts.
 */
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

/**
 * Aggregate function which subscribes the app to the following events:
 * - SaleStatus
 * - NewPrice
 * - NewTopBidder
 * - NewGarageApproval
 * - Transfer
 * - Approve
 */
const subscribeToChainEvents = () => {
  return async (dispatch) => {
    dispatch(subscribeToTransfers())
    dispatch(subscribeToEvent("SaleStatus") )
    dispatch(subscribeToEvent("NewPrice"))
    dispatch(subscribeToEvent("NewTopBidder"))
    dispatch(subscribeToEvent("NewGarageApproval"))
    dispatch(subscribeToApproval())
  }
}
