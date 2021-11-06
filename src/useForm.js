import { useState, useEffect } from 'react';


const useForm = (callback, validate) => {
  const [values, setValues] = useState({
    company: '',
    model: '',
    vhcid: '',
    year: '',
    color: '',
    body: '',
    transmission: '',
    fuel: '',
    engine: '',
    doors: '',
    seats: '',
    driver_side: '',
    mileage: 0,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  let [step, setStep] = useState(0);

  const handleChange = e => {

    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();

    let es = validate(step,values)
    setErrors(es);

    if (es && Object.entries(es).length === 0)
    {
      callback(values);
      //setIsSubmitting(true);

    }

  };

  const nextStep = e => {
    e.preventDefault();
    
    let es = validate(step,values)
    setErrors(es);

    if (es && Object.entries(es).length === 0)
    {
      step = step + 1
      setStep(step)
    }
    
  }

  const prevStep = e => {
    e.preventDefault();
    step = step - 1
    setStep(step)

  }

  useEffect(
    () => {
      if (Object.keys(errors).length === 0 && isSubmitting) {
        callback(values);
      }
    },
    [errors]
  );

  return { handleChange, handleSubmit, nextStep, prevStep, values, errors, step };
};

export default useForm;
