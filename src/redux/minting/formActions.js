// log
import store from "../store";
import validate from "../../components/form/validate";



const fetchNextStep = (payload) => {
  return {
    type: "NEXT_STEP",
    payload: payload,
  };
};

const fetchPrevStep = (payload) => {
  return {
    type: "PREV_STEP",
    payload: payload,
  };
};

const fetchUpdate = (payload) => {
  return {
    type: "UPDATE",
    payload: payload,
  };
};

const fetchUploadImage = (payload) => {
  return {
    type: "UPLOAD_IMAGE",
    payload: payload,
  };
};


const fetchStartSubmit = () => {
  return {
    type: "START_SUBMIT",
  };
};

const fetchFinishSubmit = () => {
  return {
    type: "FINISH_SUBMIT",
  };
};

const fetchErrorUpdate = (payload) => {
  return {
    type: "ERROR_UPDATE",
    payload: payload,
  };
};


const getStoreState = () => {
  return store.getState().form;
}


export const handleChange = e => {
  return async (dispatch) => {

    const { name, value } = e.target;

    dispatch(
      fetchUpdate({ name, value })
    );
  }
};

export const nextStep = (step) => {
  return async (dispatch) => {

    const form = getStoreState();

    if (form.errors && Object.entries(form.errors).length === 0) {
      dispatch(
        fetchNextStep({ step })
      );
    }

  };
};

export const checkForErrors = e => {
  return async (dispatch) => {

    e.preventDefault();

    const form = getStoreState();
    let errors = validate(form.step, form)

    dispatch(
      fetchErrorUpdate({ errors })
    );

  };
};

export const prevStep = (step) => {
  return async (dispatch) => {

    dispatch(
      fetchPrevStep({ step })
    );

  };
};

export const startSubmit = e => {
  return async (dispatch) => {

    e.preventDefault();
    /*

    let es = validate(step,values)
 
    if (es && Object.entries(es).length === 0)
    {
      
    }
    */

    const form = getStoreState();

    if (form.errors && Object.entries(form.errors).length === 0) {
  
        dispatch(
          fetchStartSubmit())
  
    }


  };
};

export const finishSubmit = e => {
  return async (dispatch) => {

    dispatch(
      fetchFinishSubmit())
  };
};

export const uploadImage = (preview, buffer) => {
  return async (dispatch) => {
    dispatch(
      fetchUploadImage({ preview, buffer })
    );
  };
};





