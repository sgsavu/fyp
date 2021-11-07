import React, { useState } from 'react';
import './styles/Form.css';
import { useDispatch, useSelector } from "react-redux";
import { nextStep, handleChange, checkForErrors } from "./redux/minting/formActions";
import validateInfo from './validate';

const Step1 = () => {

  const dispatch = useDispatch();
  const form = useSelector((state) => state.form);
  let errors = validateInfo(form.step, form)
  console.log(form)
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
            value={form.company}
            onChange={(e) => dispatch(handleChange(e))}
          />
          {errors.company && <p>{errors.company}</p>}
        </div>
        <div className='form-inputs'>
          <label className='form-label'>Model</label>
          <input
            className='form-input'
            type='text'
            name='model'
            placeholder='eg. Model X, CLA'
            value={form.model}
            onChange={(e) => dispatch(handleChange(e))}
          />
          {errors.model && <p>{errors.model}</p>}
        </div>
        <div className='form-inputs'>
          <label className='form-label'>Internal Vehicle ID</label>
          <input
            className='form-input'
            type='text'
            name='vhcid'
            placeholder='eg. 1892AJH82'
            value={form.vhcid}
            onChange={(e) => dispatch(handleChange(e))}
          />
          {errors.vhcid && <p>{errors.vhcid}</p>}
        </div>
        <div className='form-inputs'>
          <label className='form-label'>Vehicle Manufacturing Year</label>
          <input
            className='form-input'
            type='search'
            name='year'
            placeholder='eg. 2020'
            value={form.year}
            onChange={(e) => dispatch(handleChange(e))}
          />
          {errors.year && <p>{errors.year}</p>}
        </div>
        <button className='form-input-btn' type='submit'>
          Next
        </button>

      </form>
    </div>
  );
};

export default Step1;
