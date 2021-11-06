import React, { useState } from 'react';
import './Form.css';
import { useDispatch, useSelector } from "react-redux";
import { nextStep, prevStep, handleChange } from "./redux/minting/formActions";
import validateInfo from './validate';

const Step2 = () => {
  

    const dispatch = useDispatch();
    const form = useSelector((state) => state.form);
    let errors = validateInfo(form.step,form)
    console.log(form)

  return ( 
    <div className='form-content-right'>
          <span className='back-btn' onClick={ (e) =>dispatch(prevStep(form.step)) } >←</span>
          <span className='page-status'>{form.step }/3</span>
          <form onSubmit={ (e) =>dispatch(nextStep(form.step)) } className='form' noValidate>
            <h1>
              Form2
            </h1>
            <div className='form-inputs'>
              <label className='form-label'>Color</label>
              <input
                className='form-input'
                type='text'
                name='color'
                placeholder='eg. Black'
                value={form.color}
                onChange={ (e) =>dispatch(handleChange(e)) }
              />
              {errors.color && <p>{errors.color}</p>}
            </div>
            <div className='form-inputs'>
              <label className='form-label'>Body</label>
              <input
                className='form-input'
                type='text'
                name='body'
                placeholder='eg. Hatchback'
                value={form.body}
                onChange={ (e) =>dispatch(handleChange(e)) }
              />
              {errors.body && <p>{errors.body}</p>}
            </div>
            <div className='form-inputs'>
              <label className='form-label'>Transmission</label>
              <input
                className='form-input'
                type='text'
                name='transmission'
                placeholder='eg. Manual'
                value={form.transmission}
                onChange={ (e) =>dispatch(handleChange(e)) }
              />
              {errors.transmission && <p>{errors.transmission}</p>}
            </div>
            <div className='form-inputs'>
              <label className='form-label'>Fuel Type</label>
              <input
                className='form-input'
                type='text'
                name='fuel'
                placeholder='eg. Diesel'
                value={form.fuel}
                onChange={ (e) =>dispatch(handleChange(e)) }
              />
              {errors.fuel && <p>{errors.fuel}</p>}
            </div>
            <button className='form-input-btn' type='submit'>
              Next
            </button>

          </form>
        </div>
);
};

export default Step2;
