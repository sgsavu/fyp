import React from 'react';
import './styles/Form.css';
import { useDispatch, useSelector } from "react-redux";
import { nextStep, handleChange, checkForErrors } from "./redux/minting/formActions";

const Step1 = () => {

  const dispatch = useDispatch();
  const form = useSelector((state) => state.form);

  return (
    <div>
      <span className='page-status'>{form.step}/3</span>
      <form onSubmit={(e) => {
        dispatch(checkForErrors(e))
        dispatch(nextStep(form.step))
      }} className='form' noValidate>
        <h1>
          Step 1: Enter
        </h1>
        <div className='form-inputs'>
          <label className='form-label'>Manufacturing Company</label>
          <input
            className='form-input'
            type='text'
            name='company'
            placeholder='eg. Tesla, Mercedes'
            value={form.fields.company}
            onChange={(e) => dispatch(handleChange(e))}
          />
          {form.errors.company && <p>{form.errors.company}</p>}
        </div>
        <div className='form-inputs'>
          <label className='form-label'>Model</label>
          <input
            className='form-input'
            type='text'
            name='model'
            placeholder='eg. Model X, CLA'
            value={form.fields.model}
            onChange={(e) => dispatch(handleChange(e))}
          />
          {form.errors.model && <p>{form.errors.model}</p>}
        </div>
        <div className='form-inputs'>
          <label className='form-label'>Internal Vehicle ID</label>
          <input
            className='form-input'
            type='text'
            name='vhcid'
            placeholder='eg. 1892AJH82'
            value={form.fields.vhcid}
            onChange={(e) => dispatch(handleChange(e))}
          />
          {form.errors.vhcid && <p>{form.errors.vhcid}</p>}
        </div>
        <div className='form-inputs'>
          <label className='form-label'>Vehicle Manufacturing Year</label>
          <input
            className='form-input'
            type='number'
            name='year'
            placeholder='eg. 2020'
            value={form.fields.year}
            onChange={(e) => dispatch(handleChange(e))}
          />
          {form.errors.year && <p>{form.errors.year}</p>}
        </div>
        <button className='form-input-btn' type='submit'>
          Next
        </button>

      </form>
    </div>
  );
};

export default Step1;
