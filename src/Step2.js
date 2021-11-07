import React from 'react';
import './styles/Form.css';
import { useDispatch, useSelector } from "react-redux";
import { nextStep, prevStep, handleChange, checkForErrors } from "./redux/minting/formActions";

const Step2 = () => {
  

    const dispatch = useDispatch();
    const form = useSelector((state) => state.form);

  return ( 
    <div >
          <span className='back-btn' onClick={ (e) =>dispatch(prevStep(form.step)) } >←</span>
          <span className='page-status'>{form.step }/3</span>
          <form onSubmit={(e) => {
        dispatch(checkForErrors(e))
        dispatch(nextStep(form.step))
      }} className='form' noValidate>
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
                value={form.fields.color}
                onChange={ (e) =>dispatch(handleChange(e)) }
              />
              {form.errors.color && <p>{form.errors.color}</p>}
            </div>
            <div className='form-inputs'>
              <label className='form-label'>Body</label>
              <input
                className='form-input'
                type='text'
                name='body'
                placeholder='eg. Hatchback'
                value={form.fields.body}
                onChange={ (e) =>dispatch(handleChange(e)) }
              />
              {form.errors.body && <p>{form.errors.body}</p>}
            </div>
            <div className='form-inputs'>
              <label className='form-label'>Transmission</label>
              <input
                className='form-input'
                type='text'
                name='transmission'
                placeholder='eg. Manual'
                value={form.fields.transmission}
                onChange={ (e) =>dispatch(handleChange(e)) }
              />
              {form.errors.transmission && <p>{form.errors.transmission}</p>}
            </div>
            <div className='form-inputs'>
              <label className='form-label'>Fuel Type</label>
              <input
                className='form-input'
                type='text'
                name='fuel'
                placeholder='eg. Diesel'
                value={form.fields.fuel}
                onChange={ (e) =>dispatch(handleChange(e)) }
              />
              {form.errors.fuel && <p>{form.errors.fuel}</p>}
            </div>
            <button className='form-input-btn' type='submit'>
              Next
            </button>

          </form>
        </div>
);
};

export default Step2;
