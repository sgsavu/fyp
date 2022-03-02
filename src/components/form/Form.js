import React, { useState } from 'react';
import '../../styles/Form.css';
import { useDispatch, useSelector } from "react-redux";
import { createMetaDataAndMint, formUpdate, nextStep, prevStep, updateMetadata } from "../../redux/minting/formActions";

const Form = () => {

  const dispatch = useDispatch();
  const form = useSelector((state) => state.form);
  const [forceUpdate, setForceUpdate] = useState(0)


  console.log("edit",form)

  function validate() {
    var currentFields = getCurrentFields()
    var pass = true
    resetErrors()

    if (form.step == form.nrOfSteps) {
      if (Object.keys(form.edit).length == 0)
        if (form.buffer.length == 0) {
          form.errors.image = 'Image required';
          pass = false
        }
    }
    else {
      for (var i = 0; i < currentFields.length; i++)
        if (form.fields[currentFields[i]] == "") {
          form.errors[currentFields[i]] = "Field Required."
          pass = false
        }
    }
    setForceUpdate(Math.floor(Math.random() * 1000))
    if (pass)
      return 1
    return 0
  }

  function resetErrors() {
    var errors = Object.keys(form.errors)
    for (var i = 0; i < errors.length; i++)
      form.errors[errors[i]] = ""
    form.errors.image = []
  }

  function getCurrentFields() {
    return Object.keys(form.fields).slice((form.step - 1) * 4, ((form.step - 1) * 4) + 4)
  }

  return (
    <div>
      {form.step != 1 ? <span className='back-btn' onClick={() => dispatch(prevStep())}>←</span> : null}
      <span className='page-status'>{form.step}/{form.nrOfSteps}</span>
      <div className='form'>
        <h1>Step {form.step}:</h1>
        {form.step == form.nrOfSteps ? <div >
          {Object.keys(form.fields).map((key, index) => {
            return (
              <div key={index} style={{ color: "white" }}>
                {key}: {form.fields[key]}
              </div>
            );
          })}
          {form.errors.image && <p style={{ color: "red" }}>{form.errors.image}</p>}
        </div>
          : getCurrentFields().map((field) => {
            return (
              <div key={field} className='form-inputs'>
                <label className='form-label'>{field}</label>
                {Object.keys(form.edit).length != 0 && form.step == 1?<input 
                  className='form-input'
                  type='text'
                  name={field}
                  disabled
                  value={form.fields[field]}
                /> : <input 
                className='form-input'
                type='text'
                name={field}
                //placeholder='eg. Tesla, Mercedes'
                value={form.fields[field]}
                onChange={(e) =>
                  dispatch(formUpdate({ name: e.target.name, value: e.target.value })
                  )}
              /> }

                
                {form.errors[field] && <p>{form.errors[field]}</p>}
              </div>
            );
          })
        }

        <button className='form-input-btn' onClick={(e) => {
          console.log("condition",Object.keys(form.edit).length)
          if (validate() == 1)
            if (form.step == form.nrOfSteps)
              if (Object.keys(form.edit).length == 0)
                dispatch(createMetaDataAndMint())
              else
                dispatch(updateMetadata())
            else
              dispatch(nextStep())
        }}>
          {form.step == form.nrOfSteps ? "Submit" : "Next"}
        </button>

      </div>
    </div>
  );
};

export default Form;
