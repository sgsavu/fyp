const initialState = {
  loading: false,
  name: "",
  myTokensMetadata: [],
  error: false,
  errorMsg: "",
  forSaleTokensMetadata: [],
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_DATA_REQUEST":
      return {
        ...initialState,
        loading: true,
      };
    case "CHECK_DATA_SUCCESS":
      return {
        ...initialState,
        loading: false,
        name: action.payload.name,
        myTokensMetadata: action.payload.myTokensMetadata,
        forSaleTokensMetadata: action.payload.forSaleTokensMetadata
      };
    case "CHECK_DATA_FAILED":
      return {
        ...initialState,
        loading: false,
        error: true,
        errorMsg: action.payload,
      };
    default:
      return state;
  }
};

export default dataReducer;
