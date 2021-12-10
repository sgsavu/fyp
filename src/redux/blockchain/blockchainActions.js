
import Web3 from "web3";
import ExternalGatewayContract from "../../abis/ExternalGateway.json";
import { fetchAllData } from "../data/dataActions";
import detectEthereumProvider from '@metamask/detect-provider';
import { randomBytes, sign } from "crypto";


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


export const initializeWallet = () => {
  return async (dispatch) => {
    try {

      const provider = await detectEthereumProvider();

      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });

      /*

      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }], // chainId must be in hexadecimal numbers
      });

      */
      
    }
    catch (err) {
      dispatch(connectFailed(err.message))
    }
  }
}

export const AVALANCHE_MAINNET_PARAMS = {
  chainId: '0xA86A',
  chainName: 'Avalanche Mainnet C-Chain',
  nativeCurrency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18
  },
  rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://snowtrace.io/']
}

export const AVALANCHE_TESTNET_PARAMS = {
  chainId: '0xA869',
  chainName: 'Avalanche Testnet C-Chain',
  nativeCurrency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18
  },
  rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://testnet.snowtrace.io/']
}


export const loadWeb3Provider = () => {
  return async (dispatch) => {
    try {

      const provider = await detectEthereumProvider();

      if (typeof provider === 'undefined')
        throw Error("No web3 wallet detected.")

      /*
      if (!provider.isMetaMask)
        throw Error("Wallet is not Metamask. Please install MetaMask.")
      */

      let web3 = new Web3(provider);

      dispatch(connectFailed("Bruh"))
    }
    catch (err) {
      dispatch(connectFailed(err.message))
    }
  }
}


export const loadSmartContract = () => {
  return async (dispatch) => {

    try {

      const provider = await detectEthereumProvider();

      let web3 = new Web3(provider);

      const walletChainId = await provider.request({
        method: "eth_chainId",
      });

      const bruh = await (await fetch(new URL("https://api.covalenthq.com/v1/chains/?quote-currency=USD&format=JSON&key=ckey_135c268318784e13be25ff66fe0"))).json();
      console.log(bruh.data.items)

      const convertedChainId = web3.utils.hexToNumber(walletChainId)
      console.log(convertedChainId)

      for (const network in bruh.data.items)
        if (convertedChainId === bruh.data.items[network].chain_id)
          console.log("found")

      console.log(walletChainId)
  
      const networkData = await ExternalGatewayContract.networks[walletChainId];
      console.log(ExternalGatewayContract.networks)
      if (!networkData)
      { 
        /*
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [AVALANCHE_TESTNET_PARAMS]
        });

        */
        throw Error("dApp not available on wallet network.")
      }
  
      const SmartContractObj = new web3.eth.Contract(
        ExternalGatewayContract.abi,
        networkData.address
      );

      console.log(SmartContractObj)

    }
    catch (err) {
      dispatch(connectFailed(err.message))
    }
  }
}



export const login = () => {
  return async (dispatch) => {

    dispatch(connectRequest());

    const provider = await detectEthereumProvider();
      let web3 = new Web3(provider);

    if (!await provider._metamask.isUnlocked())
        throw Error("Wallet is locked. Please unlock.")

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    

    /*
    SIGNATURE
    const signMessage = (message, publicAddress) => {
      return new Promise((resolve, reject) =>
        web3.eth.personal.sign(
          web3.utils.utf8ToHex(message),
          publicAddress,
          (err, signature) => {
            if (err) return reject(err);
            return resolve({ signature });
          }
        )
      );
    };
    const verifySignature = async (message, signature, address) => {
      if (await web3.eth.accounts.recover(message, signature) !== address) {
        throw Error("Bruh not you");
      }
    }
    const authenticate = async (address) => {
      const dAppname = "Vehicle"
      const nonce = randomBytes(32).toString('base64')
      const message = `Hi there from ${dAppname}! Sign this message to prove you have access to this wallet and we’ll log you in. This won’t cost you anything.To stop hackers using your wallet, here’s a unique message ID they can’t guess: ${nonce}`
      const signature = await signMessage(message, address)
      await verifySignature(message, signature, address);
    }
    */

    dispatch(
      connectSuccess({
        account: Web3.utils.toChecksumAddress(accounts[0])
      })
    );

    window.ethereum.on("accountsChanged", () => {
      dispatch(updateAccount(Web3.utils.toChecksumAddress(window.ethereum.selectedAddress)));
    });
    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });





  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: account }));
    dispatch(fetchAllData(account));
  };
};
