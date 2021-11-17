import { actions, roles } from "../../pages/PermissionsAndRoles";

const initialState = {
  loading: false,
  myVehicles: [],
  vehiclesForSale: [],
  allVehicles: [],
  myRole: roles.USER_ROLE,
  error: false,
  errorMsg: ""
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_DATA_REQUEST":
      return {
        ...initialState,
        loading: true,
      };
    case "FETCH_DATA_SUCCESS":
      return {
        ...initialState,
        loading: false,
        myVehicles: action.payload.myVehicles,
        vehiclesForSale: action.payload.vehiclesForSale,
        myRole: action.payload.myRole,
        allVehicles: action.payload.allVehicles
      };
    case "FETCH_DATA_FAILED":
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
