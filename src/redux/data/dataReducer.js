import { actions, roles } from "../../components/utils/Roles";

const initialState = {
  allVehicles: {},
  displayCurrency: "GBP",
  myRole: roles.VIEWER_ROLE,
};

/**
 * The data reducer.
 * In the case of dispatching to update the data state the value
 * of the field is simply updated
 * In the case of entry data state the value is simply inserted
 * as to facilitate event triggers in the react components
 * In the case of Delete field key a certain field is deleted
 * from the state
 */
const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_DATA_STATE":
      return {
        ...state,
        [action.payload.field]: action.payload.value,
      };
    case "ENTRY_DATA_STATE":
      let field = state[action.payload.field]
      if (action.payload.subfield)
        field = field[action.payload.subfield]
      field[action.payload.key] = action.payload.value
      if (action.payload.subfield)
      return {
        ...state,
        [action.payload.field]: {
          ...state[action.payload.field],
          [action.payload.subfield]:field
        }
      };
      else 
      return {
        ...state,
        [action.payload.field]: field
      };
    case "COMPLEX_DATA_MODIFY":
      let complex = state
      action.payload.fields.forEach(element => {
        complex = complex[element]
      });
      complex[action.payload.key] = action.payload.value
      return {
        ...state,
        [action.payload.field]: field
      };
    case "DELETE_FIELD_KEY":
      let field2 = state[action.payload.field]
      delete field2[action.payload.key]
      return {
        ...state,
        [action.payload.field]: field2
      };
    default:
      return state;
  }
};

export default dataReducer;
