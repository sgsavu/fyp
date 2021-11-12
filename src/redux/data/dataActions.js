// log
import store from "../store";

const keccak256 = require('keccak256')

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

async function fetchMetadata (nfts){

  let fetchedTokens = []

      for (const nft of nfts){
        await fetch(nft)
        .then((response) => response.json())
        .then((metaData) => {
          fetchedTokens = [...fetchedTokens,metaData]
        })
        .catch((err) => {
          console.log(err);
        });
      }

  return fetchedTokens
}

async function getTokenURI (token){
  return await store
  .getState()
  .blockchain.smartContract.methods
  .tokenURI(token)
  .call();
}

async function getExtraRoles (account){

  if (await store
    .getState()
    .blockchain.smartContract.methods
    .hasRole("0x00",account)
    .call())
    return "ADMIN"
  else if (await store
      .getState()
      .blockchain.smartContract.methods
      .hasRole(keccak256('AUTHORITY_ROLE'),account)
      .call())
      return "AUTHORITY"
  else if (await store
    .getState()
    .blockchain.smartContract.methods
    .hasRole(keccak256('MINTER_ROLE'),account)
    .call())
    return "MINTER"
  else
    return "USER"
  
}

export const fetchData = (account) => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {


      let role = await getExtraRoles(account)

      let name = await store
        .getState()
        .blockchain.smartContract.methods.name()
        .call();

      let myTokenBalance = await store
        .getState()
        .blockchain.smartContract.methods.balanceOf(account)
        .call();

      let forSaleTokenIds = await store
        .getState()
        .blockchain.smartContract.methods.getTokensForSale()
        .call();

      let totalTokenSupply = await store
        .getState()
        .blockchain.smartContract.methods.totalSupply()
        .call();

      let myTokenIds = []
      
      for (var i = 0;i<myTokenBalance;i++)
      {
          let token = await store
          .getState()
          .blockchain.smartContract.methods
          .tokenOfOwnerByIndex(account,i)
          .call();

          myTokenIds = [...myTokenIds, token]
      }

      let myTokenURIs = []

      for (var i = 0;i<myTokenBalance;i++)
      {
        let tokenURI = await getTokenURI(myTokenIds[i])
        myTokenURIs = [...myTokenURIs, tokenURI]
      }

      let myTokensMetadata = await fetchMetadata(myTokenURIs)
      console.log(myTokensMetadata)

      let forSaleTokenURIs = []

      for (var i = 0;i<totalTokenSupply;i++)
      {
        let tokenURI = await getTokenURI(forSaleTokenIds[i])
        forSaleTokenURIs = [...forSaleTokenURIs, tokenURI]
      }
    
      let forSaleTokensMetadata = await fetchMetadata(forSaleTokenURIs)

      console.log("for sale",forSaleTokensMetadata)
    
      dispatch(
        fetchDataSuccess({
          name,
          myTokensMetadata,
          forSaleTokensMetadata,
          role,
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
