import { roles } from "../../pages/PermissionsAndRoles";

const initialState = {
  loading: false,
  myVehicles: [],
  error: false,
  errorMsg: "",
  vehiclesForSale: [],
  myRole: roles.USER_ROLE
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
        myVehicles: action.payload.myVehicles,
        vehiclesForSale: action.payload.vehiclesForSale,
        myRole: action.payload.myRole,
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
