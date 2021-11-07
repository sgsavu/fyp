import React from 'react';
import './styles/Form.css';
import { useSelector } from "react-redux";
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

const FormSignup = () => {

  const form = useSelector((state) => state.form);

  return (

    (() => {

      switch (form.step) {
        case 1: return (<Step1 />);
        case 2: return (<Step2 ></Step2>);
        case 3: return (<Step3 ></Step3>);
        
        default: return null
      }

    })()

  );
};

export default FormSignup;
