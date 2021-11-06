
const formFields = {
  step: 1,
  image: "",
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
            [action.payload.name]:action.payload.value
          }
     
    default:
      return state;
  }
};

export default formReducer;
