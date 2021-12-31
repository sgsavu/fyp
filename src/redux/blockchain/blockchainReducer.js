const initialState = {
  account: null,
  smartContract: null,
  web3: null,
  currentNetwork: null,
  availableNetworks: null,
  walletProvider: null,
};

const blockchainReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_STATE":
      return {
        ...state,
        [action.payload.field]: action.payload.value,
      };
    default:
      return state;
  }
};

export default blockchainReducer;
