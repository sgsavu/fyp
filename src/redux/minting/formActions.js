import store from "../store";
import validate from "../../components/minting_form/validate";

const formNextStep = () => {
  return {
    type: "NEXT_STEP",
  };
};

const formPrevStep = () => {
  return {
    type: "PREV_STEP",
  };
};

const formUpdate = (payload) => {
  return {
    type: "UPDATE",
    payload: payload,
  };
};

const formUploadImage = (payload) => {
  return {
    type: "UPLOAD_IMAGE",
    payload: payload,
  };
};

const formStartSubmit = () => {
  return {
    type: "START_SUBMIT",
  };
};

const formFinishSubmit = () => {
  return {
    type: "FINISH_SUBMIT",
  };
};

const formErrorSubmit = () => {
  return {
    type: "ERROR_SUBMIT",
  };
};

const formUpdateErrors = (payload) => {
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
      formUpdate({ name, value })
    );
  }
};

export const nextStep = () => {
  return async (dispatch) => {
    const form = getStoreState();
    if (form.errors && Object.entries(form.errors).length === 0) {
      dispatch(
        formNextStep()
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
      formUpdateErrors({ errors })
    );
  };
};

export const prevStep = () => {
  return async (dispatch) => {
    dispatch(
      formPrevStep()
    );
  };
};

export const startSubmit = e => {
  return async (dispatch) => {
    e.preventDefault();
    const form = getStoreState();
    if (form.errors && Object.entries(form.errors).length === 0) {
      dispatch(
        formStartSubmit()
      );
    }
  };
};

export const finishSubmit = e => {
  return async (dispatch) => {
    dispatch(
      formFinishSubmit())
  };
};

export const errorSubmit = e => {
  return async (dispatch) => {
    dispatch(
      formErrorSubmit())
  };
};

export const uploadImage = (preview, buffer) => {
  return async (dispatch) => {
    dispatch(
      formUploadImage({ preview, buffer })
    );
  };
};





