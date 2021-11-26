import { actions, roles } from "../../utils/PermissionsAndRoles";

const initialState = {
  loading: false,
  myVehicles: [],
  vehiclesForSale: [],
  allVehicles: [],
  displayCurrency: "GBP",
  myRole: roles.USER_ROLE,
  error: false,
  errorMsg: "",
  myBids: []
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_DATA_REQUEST":
      return {
        ...state,
        loading: true,
      };
    case "FETCH_DATA_SUCCESS":
      return {
        ...state,
        loading: false,
        myVehicles: action.payload.myVehicles,
        vehiclesForSale: action.payload.vehiclesForSale,
        myRole: action.payload.myRole,
        allVehicles: action.payload.allVehicles
      };
    case "FETCH_DATA_FAILED":
      return {
        ...state,
        loading: false,
        error: true,
        errorMsg: action.payload,
      };
    case "UPDATE_MY_VEHICLES":
      return {
        ...state,
        loading: false,
        myVehicles: action.payload
      };
    case "UPDATE_VEHICLES_FOR_SALE":
      return {
        ...state,
        loading: false,
        vehiclesForSale: action.payload
      };
    case "UPDATE_ALL_VEHICLES":
      return {
        ...state,
        loading: false,
        allVehicles: action.payload
      };
    case "UPDATE_DISPLAY_CURRENCY":
      return {
        ...state,
        displayCurrency: action.payload
      };
    case "UPDATE_ROLE":
      return {
        ...state,
        myRole: action.payload
      };
      case "UPDATE_MY_BIDS":
        return {
          ...state,
          myBids: action.payload
        };
    default:
      return state;
  }
};

export default dataReducer;
