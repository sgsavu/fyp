import { actions, roles } from "../../components/utils/PermissionsAndRoles";

const initialState = {
  myVehicles: {},
  saleVehicles: {},
  allVehicles: {},
  myBids: {},
  displayCurrency: "GBP",
  myRole: roles.VIEWER_ROLE,
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
