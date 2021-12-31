import { actions, roles } from "../../components/utils/PermissionsAndRoles";

const initialState = {
  myVehicles: [],
  saleVehicles: [],
  allVehicles: [],
  displayCurrency: "GBP",
  myRole: roles.USER_ROLE,
  myBids: []
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_DATA_STATE":
      return {
        ...state,
        [action.payload.field]: action.payload.value,
      };
    default:
      return state;
  }
};

export default dataReducer;
