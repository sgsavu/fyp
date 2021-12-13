
import Web3 from "web3";
import ExternalGatewayContract from "../../abis/ExternalGateway.json";
import { fetchMyData, refresh } from "../data/dataActions";
import detectEthereumProvider from '@metamask/detect-provider';
import { randomBytes, sign } from "crypto";
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

const updateAccountRequest = (payload) => {
  return {
    type: "UPDATE_ACCOUNT",
    payload: payload,
  };
};


const getDeployedChains = (contract) => {
  const deployed = []
  for (var property in contract.networks)
    contract.networks[property] = contract.networks[property].address
  Object.keys(contract.networks).forEach((entry) => {
    deployed.push({ chain_id: entry, address: contract.networks[entry] })
  })
  return deployed
}

export const loadWeb3Provider = () => {
  return async (dispatch) => {
    try {

      dispatch(loading(true));

      const provider = await detectEthereumProvider();

      if (!provider)
        throw Error("No web3 wallet detected. Please install a web3 wallet such as MetaMask.")

      var web3 = new Web3(Web3.givenProvider)


      dispatch(updateState({ field: "web3", value: web3 }))
      dispatch(updateState({ field: "provider", value: provider }))
      dispatch(loading(false));
    }
    catch (err) {
      dispatch(connectFailed(err.message))
    }
  }
}


export const loadNetworks = () => {
  return async (dispatch) => {

    try {
      dispatch(loading(true));

      const deployedChains = getDeployedChains(ExternalGatewayContract)

      console.log (deployedChains)

      dispatch(updateState({ field: "availableNetworks", value: deployedChains }))
      dispatch(updateState({ field: "currentNetwork", value: deployedChains[3] }))

      dispatch(loading(false));

    }
    catch (err) {
      dispatch(connectFailed(err.message))
    }
  }
}


export const loadSmartContract = () => {
  return async (dispatch) => {

    try {

      dispatch(loading(true));

      const currentNetwork = await store.getState().blockchain.currentNetwork

      console.log(currentNetwork)
      const web3 = await store.getState().blockchain.web3
      const SmartContractObj = new web3.eth.Contract(
        ExternalGatewayContract.abi,
        currentNetwork.address
      );

      console.log("newContractObject", SmartContractObj)

      dispatch(updateState({ field: "smartContract", value: SmartContractObj }))

      dispatch(loading(false));

    }
    catch (err) {

      dispatch(connectFailed(err.message))
    }
  }
}


export const login = () => {
  return async (dispatch) => {

    dispatch(loading(true));

    const web3 = await store.getState().blockchain.web3
    const provider = await store.getState().blockchain.provider

    if (!await store.getState().blockchain.provider._metamask.isUnlocked())
      throw Error("Wallet is locked. Please unlock.")

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const walletChainId = await provider.request({
      method: "eth_chainId",
    });

    const convertedChainId = Web3.utils.hexToNumber(walletChainId)

    const dAppNetwork = await store.getState().blockchain.currentNetwork.chain_id

    if (dAppNetwork != convertedChainId) {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [ALL_TEMPLATES[dAppNetwork]]
      });
    }

    dispatch(
      updateState({
        field: "account", value: Web3.utils.toChecksumAddress(accounts[0])
      })
    );

    dispatch(
      fetchMyData()
    )

    dispatch(loading(false));
  };
};




export const forceUserToChange = (dAppNetwork) => {
  return async (dispatch) => {
    const provider = await store.getState().blockchain.provider
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [ALL_TEMPLATES[dAppNetwork]]
    });
  }
}

export const updateNetwork = (newNetwork) => {
  return async (dispatch) => {
    await store.getState().blockchain.availableNetworks.forEach(element => {
      if (element.chain_id === Web3.utils.hexToNumber(newNetwork).toString())
        dispatch(updateState({ field: "currentNetwork", value: element }))
    });
  };
}

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: account }));
    dispatch(fetchMyData(account));
  };
};
