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
    case "FETCH_DATA_FAILED":
      return {
        ...state,
        loading: false,
        error: true,
        errorMsg: action.payload,
      };
    case "UPDATE_STATE":
      return {
        ...state,
        loading: false,
        [action.payload.field]: action.payload.value
      };
    default:
      return state;
  }
};

export default dataReducer;
