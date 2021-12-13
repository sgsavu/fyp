const initialState = {
  loading: false,
  account: null,
  smartContract: null,
  web3: null,
  error: false,
  errorMsg: "",
  currentNetwork: "5777",
  availableNetworks: [],
  provider: null,
};

const blockchainReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CONNECTION_FAILED":
      return {
        ...initialState,
        loading: false,
        errorMsg: action.payload,
      };
    case "UPDATE_ACCOUNT":
      return {
        ...state,
        account: action.payload.account,
      };
    case "UPDATE_STATE":
      return {
        ...state,
        [action.payload.field]: action.payload.value,
      };
    case "LOADING":
      return {
        ...state,
        loading: action.payload
      }
    default:
      return state;
  }
};

export default blockchainReducer;
