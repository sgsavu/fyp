const initialState = {
  account: null,
  smartContract: null,
  web3: null,
  currentNetwork: null,
  availableNetworks: null,
  walletProvider: null,
  pendingTx: [], 
};

const blockchainReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_BLOCKCHAIN_STATE":
      return {
        ...state,
        [action.payload.field]: action.payload.value,
      };
    case "TX":
      var txState = state.pendingTx
      if(action.payload.message)
        txState.push(action.payload.message)
      else
        txState.pop()
      console.log(txState)
      return {
        ...state,
        pendingTx: txState
      };
    default:
      return state;
  }
};

export default blockchainReducer;
