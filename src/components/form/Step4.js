import React from 'react';
import '../../styles/Form.css';
import { useDispatch, useSelector } from "react-redux";
import { startSubmit, prevStep, handleChange, checkForErrors } from "../../redux/minting/formActions";

const Step4 = () => {


    const dispatch = useDispatch();
    const form = useSelector((state) => state.form);

    const xd = () => {

        let fildz = []
        let valuz = []

        for (const [key, value] of Object.entries(form.fields)) {
            fildz = [...fildz, key]
            valuz = [...fildz, value]
        }

        
    }

    return (
        <div>
            <span className='back-btn' onClick={(e) => dispatch(prevStep(form.step))}>←</span>
            <span className='page-status'>{form.step}/3</span>

            <form onSubmit={(e) => {
                dispatch(checkForErrors(e))
                dispatch(startSubmit(e))
            }} className='form' noValidate>
                <h1>Confirm details</h1>
            

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
