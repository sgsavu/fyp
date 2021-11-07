import React, { useState } from 'react';
import './styles/Form.css';
import { useDispatch, useSelector } from "react-redux";
import { startSubmit, prevStep, handleChange,checkForErrors } from "./redux/minting/formActions";
import validateInfo from './validate';

const Step3 = () => {
  

    const dispatch = useDispatch();
    const form = useSelector((state) => state.form);
    let errors = validateInfo(form.step,form)
    console.log(form)

  return ( 
    <div>
          <span className='back-btn' onClick={ (e) =>dispatch(prevStep(form.step)) }>←</span>
          <span className='page-status'>{form.step}/3</span>

          <form onSubmit={(e) => {
        dispatch(checkForErrors(e))
        dispatch(startSubmit(e))
      }} className='form' noValidate>
            <h1>
              Form3
            </h1>
            <div className='form-inputs'>
              <label className='form-label'>Engine</label>
              <input
                className='form-input'
                type='text'
                name='engine'
                placeholder='eg. V10'
                value={form.engine}
                onChange={ (e) =>dispatch(handleChange(e)) }
              />
              {errors.engine && <p>{errors.engine}</p>}
            </div>
            <div className='form-inputs'>
              <label className='form-label'>Number of doors</label>
              <input
                className='form-input'
                type='text'
                name='doors'
                placeholder='eg. 5'
                value={form.doors}
                onChange={ (e) =>dispatch(handleChange(e)) }
              />
              {errors.doors && <p>{errors.doors}</p>}
            </div>
            <div className='form-inputs'>
              <label className='form-label'>Number of seats</label>
              <input
                className='form-input'
                type='text'
                name='seats'
                placeholder='eg. 5'
                value={form.seats}
                onChange={ (e) =>dispatch(handleChange(e)) }
              />
              {errors.seats && <p>{errors.seats}</p>}
            </div>
            <div className='form-inputs'>
              <label className='form-label'>Driver Side</label>
              <input
                className='form-input'
                type='text'
                name='driver_side'
                placeholder='eg. Left'
                value={form.driver_side}
                onChange={ (e) =>dispatch(handleChange(e)) }
              />
              {errors.driver_side && <p>{errors.driver_side}</p>}
            </div>
            {!form.submitting? <button className='form-input-btn' type='submit'>
              Confirm
            </button> : null}
            

          </form>
        </div>
);
};

export default Step3;
