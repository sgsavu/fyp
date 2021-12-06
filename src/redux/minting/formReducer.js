
const formFields = {
  nrOfSteps: 4,
  step: 1,
  preview: "https://s3-alpha.figma.com/hub/file/948140848/1f4d8ea7-e9d9-48b7-b70c-819482fb10fb-cover.png",
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
  },
  errors: {}
};

const formReducer = (state = formFields, action) => {
  switch (action.type) {
    case "NEXT_STEP":
      return {
        ...state,
        step: state.step + 1,
      };
    case "PREV_STEP":
      return {
        ...state,
        step: state.step - 1,
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
    case "ERROR_SUBMIT":
      return {
        ...state,
        submitting: false
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
