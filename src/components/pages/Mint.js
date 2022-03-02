import React from 'react';
import '../../styles/Form.css';
import '../../styles/drop.css';
import Form from '../form/Form';
import Dropzone from '../form/Dropzone';

const Mint = () => {

    return (
        <div className='form-container'>
            <div className='form-content-left'>
                <Dropzone />
            </div>
            <div className='form-content-right'>
                <Form />
            </div>
        </div>
    );
};

export default Mint;
