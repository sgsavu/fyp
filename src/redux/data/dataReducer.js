import { actions, roles } from "../../pages/PermissionsAndRoles";

const initialState = {
  loading: false,
  myVehicles: [],
  vehiclesForSale: [],
  allVehicles: [],
  currency: "GBP",
  myRole: roles.USER_ROLE,
  error: false,
  errorMsg: ""
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
    case "REFRESH_MY_VEHICLES":
      return {
        ...state,
        loading: false,
        myVehicles: action.payload
      };
    case "REFRESH_VEHICLES_FOR_SALE":
      return {
        ...state,
        loading: false,
        vehiclesForSale: action.payload
      };
    case "REFRESH_ALL_VEHICLES":
      return {
        ...state,
        loading: false,
        allVehicles: action.payload
      };
    case "UPDATE_FAV_CURRENCY":
      return {
        ...state,
        currency: action.payload
      };
    default:
      return state;
  }
};

export default dataReducer;
