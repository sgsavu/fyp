import React, { useState } from 'react';
import '../../styles/MintForm.css';
import { useDispatch, useSelector } from "react-redux";
import { createMetaDataAndMint, formUpdate, nextStep, prevStep, updateMetadata } from "../../redux/minting/formActions";
import { IconButton, Stack, TextField, Typography } from '@mui/material';
import { IoMdArrowBack } from "react-icons/io";


/**
  * The form component. It allows the user to type in the values
  * for minting/editing etc. It is linked to the redux value store with the
  * same name for data storing.
  */
const Form = () => {

  const dispatch = useDispatch();
  const form = useSelector((state) => state.form);
  const [forceUpdate, setForceUpdate] = useState(0)

  /**
  * Checks if any of the fields have been left uninputted.
  * If so set the redux value of the errors for those fields to 
  * required.
  */
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

  function getPlaceholder(field) {
    var returntext = "eg. "
    switch (field) {
      case "company":
        return returntext + "Tesla";
      case "model":
        return returntext + "Model X";
      case "vhcid":
        return returntext + "TSLA298173827D81"
      case "year":
        return returntext + "2020"
      case "color":
        return returntext + "Black"
      case "body":
        return returntext + "Hatchback"
      case "transmission":
        return returntext + "Automatic"
      case "fuel":
        return returntext + "Electric"
      case "engine":
        return returntext + "AWD 60"
      case "doors":
        return returntext + "7"
      case "seats":
        return returntext + "5"
      case "driver_side":
        return returntext + "Left"
    }
  }

  return (
    <Stack
      sx={{

        color: "white",
        background: "linear-gradient(90deg, rgb(40, 40, 40) 0%, rgb(17, 17, 17) 100%)",
      }}

      borderRadius={{xs: "0 0 10px 10px", sm: "0 0 10px 10px", md: "0 0 10px 10px", lg: "0 10px 10px 0px"}}  
      padding={6}
      width={{ xs: "100%", sm: "100%", md: "100%", lg: "50%" }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
      >
        <Stack>
          {form.step != 1 ?
            <IconButton sx={{ color: "white" }} onClick={() => dispatch(prevStep())} >
              <IoMdArrowBack />
            </IconButton> : null}
        </Stack>
        <Stack alignItems="end">
          <span >{form.step}/{form.nrOfSteps}</span>
        </Stack>
      </Stack>


      <Stack padding={1} spacing={4} alignItems="center" justifyContent="center">
        <Typography>
          Step {form.step}:
        </Typography>
        {form.step == form.nrOfSteps ?
          <Stack display="flex" alignItems="center" justifyContent="center">
            {Object.keys(form.fields).map((key, index) => {
              return (
                <div key={index}>
                  {key}: {form.fields[key]}
                </div>
              );
            })}
            {form.errors.image && <p>{form.errors.image}</p>}
          </Stack>
          : getCurrentFields().map((field) => {
            return (
              <Stack width="90%" key={field}>
                <label>{field}</label>

                <TextField
                  placeholder={getPlaceholder(field)}
                  sx={{
                    backgroundColor: "white",

                    '& .MuiOutlinedInput-input': {
                      padding: 1,
                      color: "black",
                      backgroundColor: "white"
                    },
                    '& .MuiFormHelperText-root': {
                      color: "red",
                    },
                  }}
                  name={field}
                  onChange={(e) =>
                    dispatch(formUpdate({ name: e.target.name, value: e.target.value })
                    )}
                  value={form.fields[field]}
                  disabled={Object.keys(form.edit).length != 0 && form.step == 1 ? true : false}
                  error={form.errors[field] ? true : false}
                />
                <p style={{ color: "red" }} >{form.errors[field] ? form.errors[field] : null}</p>

              </Stack>
            );
          })
        }


        <button style={{marginTop: "60px"}} className='form-input-btn' disabled={form.loading ? true : false} onClick={(e) => {
          if (validate() == 1)
            if (form.step == form.nrOfSteps)
              if (Object.keys(form.edit).length == 0)
                dispatch(createMetaDataAndMint())
              else
                dispatch(updateMetadata())
            else
              dispatch(nextStep())
        }}>
          {form.loading ? "Loading" : form.step == form.nrOfSteps ? "Submit" : "Next"}
        </button>


      </Stack>
    </Stack>
  );
};

export default Form;
