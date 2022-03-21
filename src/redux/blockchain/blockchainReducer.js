const initialState = {
  account: null,
  smartContracts: [],
  web3: null,
  currentNetwork: null,
  networkTables: null,
  walletProvider: null,
  pendingTx: [], 
};


/**
 * The blockchain reducer. 
 * In the case of dispatches related directly to the state it
 * simply updates that respective field with the new value
 * In the case of transactions (TX) it creates a 'stack' last in
 * first out to queue pending transaction messages.
 */
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
      return {
        ...state,
        pendingTx: txState
      };
    default:
      return state;
  }
};

export default blockchainReducer;
