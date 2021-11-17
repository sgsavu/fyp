import React from 'react';
import '../../styles/Form.css';
import { useDispatch, useSelector } from "react-redux";
import { startSubmit, prevStep, checkForErrors } from "../../redux/minting/formActions";

const Step4 = () => {


    const dispatch = useDispatch();
    const form = useSelector((state) => state.form);
    const detailsToConfirm = form.fields;

    return (
        <div>
            <span className='back-btn' onClick={(e) => dispatch(prevStep())}>←</span>
            <span className='page-status'>{form.step}/{form.nrOfSteps}</span>

            <form onSubmit={(e) => {
                dispatch(checkForErrors(e))
                dispatch(startSubmit(e))
            }} className='form' noValidate>
                <h1>Confirm details</h1>
                {Object.keys(detailsToConfirm).map((key,index) => {
                   // if (key!="mileage")
                    return (
                        <div key={index} style={{color:"white"}}>
                        {key}: {detailsToConfirm[key]}
                        </div>
                    );
                })}

                {!form.submitting ? <button className='form-input-btn' type='submit'>
                    Confirm
                </button> : <button className='form-input-btn' disabled type='loading'>
                    Loading...
                </button>}


            </form>
        </div>
    );
};

export default Step4;
