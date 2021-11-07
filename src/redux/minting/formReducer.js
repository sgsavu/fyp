
const formFields = {
  step: 1,
  preview: "https://designshack.net/wp-content/uploads/placeholder-image.png",
  buffer: [],
  submitting: false,
  fields: {
    company: '',
    model: '',
    vhcid: '',
    year: '',
    color: '',
    body: '',
    transmission: '',
    fuel: '',
    engine: '',
    doors: '',
    seats: '',
    driver_side: '',
    mileage: 0,
  },
  errors: {}
};

const formReducer = (state = formFields, action) => {
  switch (action.type) {
    case "NEXT_STEP":
      return {
        ...state,
        step: action.payload.step + 1,
      };
    case "PREV_STEP":
      return {
        ...state,
        step: action.payload.step - 1,
      };
    case "UPDATE":

      return {
        ...state,
        fields: {
          ...state.fields,
          [action.payload.name]: action.payload.value
        }
      }
    case "UPLOAD_IMAGE":

      return {
        ...state,
        preview: action.payload.preview,
        buffer: action.payload.buffer
      }
    case "START_SUBMIT":

      return {
        ...state,
        submitting: true
      }
    case "FINISH_SUBMIT":

      return {
        ...formFields
      }

    case "ERROR_UPDATE":

      return {
        ...state,
        errors: action.payload.errors
      }

    default:
      return state;
  }
};

export default formReducer;
