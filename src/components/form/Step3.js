import React from 'react';
import '../../styles/Form.css';
import { useDispatch, useSelector } from "react-redux";
import { nextStep, prevStep, handleChange, checkForErrors } from "../../redux/minting/formActions";

const Step3 = () => {


  const dispatch = useDispatch();
  const form = useSelector((state) => state.form);

  return (
    <div>
      <span className='back-btn' onClick={(e) => dispatch(prevStep())}>←</span>
      <span className='page-status'>{form.step}/{form.nrOfSteps}</span>

      <form onSubmit={(e) => {
        dispatch(checkForErrors(e))
        dispatch(nextStep())
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
            value={form.fields.engine}
            onChange={(e) => dispatch(handleChange(e))}
          />
          {form.errors.engine && <p>{form.errors.engine}</p>}
        </div>
        <div className='form-inputs'>
          <label className='form-label'>Number of doors</label>
          <input
            className='form-input'
            type='number'
            name='doors'
            placeholder='eg. 5'
            value={form.fields.doors}
            onChange={(e) => dispatch(handleChange(e))}
          />
          {form.errors.doors && <p>{form.errors.doors}</p>}
        </div>
        <div className='form-inputs'>
          <label className='form-label'>Number of seats</label>
          <input
            className='form-input'
            type='number'
            name='seats'
            placeholder='eg. 5'
            value={form.fields.seats}
            onChange={(e) => dispatch(handleChange(e))}
          />
          {form.errors.seats && <p>{form.errors.seats}</p>}
        </div>
        <div className='form-inputs'>
          <label className='form-label'>Driver Side</label>
          <input
            className='form-input'
            type='text'
            name='driver_side'
            placeholder='eg. Left'
            value={form.fields.driver_side}
            onChange={(e) => dispatch(handleChange(e))}
          />
          {form.errors.driver_side && <p>{form.errors.driver_side}</p>}
        </div>
        <button className='form-input-btn' type='submit'>
          Next
        </button>


      </form>
    </div>
  );
};

export default Step3;
