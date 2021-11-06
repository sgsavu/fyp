// log
import store from "../store";
import validate from "../../validate";

const fetchUpdate = (payload) => {
    return {
      type: "UPDATE",
      payload: payload,
    };
  };

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

  const fetchHandleSubmit = (payload) => {
    return {
      type: "HANDLE_SUBMIT",
      payload: payload,
    };
  };



  

  export const handleChange = e => {
    return async (dispatch) => {

    const { name, value } = e.target;
    
    dispatch(
        fetchUpdate({name,value})
        );
    }
  };

  export const nextStep = (step) => {
    return async (dispatch) => {
      /*
    e.preventDefault();
    let es = validate(step,values)
    setErrors(es);
    */
    /*
    if (es && Object.entries(es).length === 0)
    {
       
    }
    */
   console.log("bruh")

    dispatch(
        fetchNextStep({step})
      );
      
    };
  };

  export const prevStep = (step) => {
    return async (dispatch) => {
      /*
    e.preventDefault();
    
    */
   console.log("aye")

    dispatch(
        fetchPrevStep({step})
      );
      
    };
  };

  export const handleSubmit = e => {
    return async (dispatch) => {
        /*
        e.preventDefault();
        let es = validate(step,values)
        setErrors(es);
    
        if (es && Object.entries(es).length === 0)
        {
          if (!isBufferEmpty())
          {
            submitForm(values);
            
          }
          //setIsSubmitting(true);
    
        }

         dispatch(
        fetchHandleSubmit({step})
      );
      
        */
    };
  };

 



