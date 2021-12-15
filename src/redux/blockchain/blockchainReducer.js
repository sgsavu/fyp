const initialState = {
  loading: [],
  account: null,
  smartContract: null,
  web3: null,
  errorMsg: "",
  currentNetwork: null,
  availableNetworks: null,
  provider: null,
};

const blockchainReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_STATE":
      return {
        ...state,
        [action.payload.field]: action.payload.value,
      };
    case "LOADING":
      const loading = state.loading
      if (action.payload)
        loading.push(action.payload)
      else
        loading.pop()
        console.log(loading)
      return {
        ...state,
        loading: loading
      }
    default:
      return state;
  }
};

export default blockchainReducer;
