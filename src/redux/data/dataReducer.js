import { actions, roles } from "../../components/utils/PermissionsAndRoles";

const initialState = {
  loading: [],
  myVehicles: [],
  vehiclesForSale: [],
  allVehicles: [],
  displayCurrency: "GBP",
  myRole: roles.USER_ROLE,
  errorMsg: "",
  myBids: []
};

const dataReducer = (state = initialState, action) => {
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

export default dataReducer;
