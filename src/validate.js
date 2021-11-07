export default function validate(step,form) {
  let errors = {};

  let values = form.fields;


  switch (step) {
    case 1:
      if (!values.company ) {
        errors.company = 'Field required';
      }
    
      if (!values.model ) {
        errors.model = 'Field required';
      }
    
      if (!values.vhcid ) {
        errors.vhcid = 'Field required';
      }
    
      if (!values.year ) {
        errors.year = 'Field required';
      }
      break;
    case 2:
      if (!values.color ) {
        errors.color = 'Field required';
      }
    
      if (!values.body ) {
        errors.body = 'Field required';
      }
    
      if (!values.transmission ) {
        errors.transmission = 'Field required';
      }
    
      if (!values.fuel ) {
        errors.fuel = 'Field required';
      }
      break;
    case 3:
      if (!values.engine ) {
        errors.engine = 'Field required';
      }
    
      if (!values.doors ) {
        errors.doors = 'Field required';
      }
    
      if (!values.seats ) {
        errors.seats = 'Field required';
      }
    
      if (!values.driver_side) {
        errors.driver_side = 'Field required';
      }
      break;
    case 4:
      if (form.preview == "https://designshack.net/wp-content/uploads/placeholder-image.png" || form.buffer == [])
      {
        errors.image = 'Image required';
      }

    default:
      
  }

  
  return errors;
}
