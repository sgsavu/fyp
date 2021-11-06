import React, { useState } from 'react';
import validate from './validate';
import useForm from './useForm';
import './Form.css';

const FormSignup = ({ submitForm }) => {
  const { handleChange, handleSubmit, nextStep, prevStep, values, errors, step } = useForm(
    submitForm,
    validate
  );


  return (
    
    (() => {
      
      switch(step) {
        case 0: return (
         
        <div className='form-content-right'>
          <span className='page-status'>{step+1}/3</span>
        <form onSubmit={nextStep} className='form' noValidate>
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
              value={values.company}
              onChange={handleChange}
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
              value={values.model}
              onChange={handleChange}
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
              value={values.vhcid}
              onChange={handleChange}
            />
            {errors.vhcid && <p>{errors.vhcid}</p>}
          </div>
          <div className='form-inputs'>
            <label className='form-label'>Vehicle Manufacturing Year</label>
            <input
              className='form-input'
              type='text'
              name='year'
              placeholder='eg. 2020'
              value={values.year}
              onChange={handleChange}
            />
            {errors.year && <p>{errors.year}</p>}
          </div>
          <button className='form-input-btn' type='submit'>
            Next
          </button>
         
        </form>
      </div>);
        case 1: return (<div className='form-content-right'>
         <span className='back-btn'onClick={prevStep} >←</span>
         <span className='page-status'>{step+1}/3</span>
        <form onSubmit={nextStep} className='form' noValidate>
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
              value={values.color}
              onChange={handleChange}
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
              value={values.body}
              onChange={handleChange}
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
              value={values.transmission}
              onChange={handleChange}
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
              value={values.fuel}
              onChange={handleChange}
            />
            {errors.fuel && <p>{errors.fuel}</p>}
          </div>
          <button className='form-input-btn' type='submit'>
            Next
          </button>
          
        </form>
      </div>);
        case 2: return (<div className='form-content-right'>
          <span className='back-btn' onClick={prevStep}>←</span>
          <span className='page-status'>{step+1}/3</span>
         
        <form onSubmit={handleSubmit} className='form' noValidate>
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
              value={values.engine}
              onChange={handleChange}
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
              value={values.doors}
              onChange={handleChange}
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
              value={values.seats}
              onChange={handleChange}
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
              value={values.driver_side}
              onChange={handleChange}
            />
            {errors.driver_side && <p>{errors.driver_side}</p>}
          </div>
          <button className='form-input-btn' type='submit'>
            Confirm
          </button>
          
        </form>
      </div>);
        default: return null
      }
      
    })()
    
    
  );
};

export default FormSignup;
