export default function validate(step,form) {

  let errors = {};
  let values = form.fields;


  switch (step) {
    case 1:
      if (!values.company ) {
        errors.company = 'Company required';
      }
    
      if (!values.model ) {
        errors.model = 'Model required';
      }
    
      if (!values.vhcid ) {
        errors.vhcid = 'Vehicle ID required';
      }
    
      if (!values.year ) {
        errors.year = 'Year required';
      }
      break;
    case 2:
      if (!values.color ) {
        errors.color = 'Color required';
      }
    
      if (!values.body ) {
        errors.body = 'Body required';
      }
    
      if (!values.transmission ) {
        errors.transmission = 'Transmission required';
      }
    
      if (!values.fuel ) {
        errors.fuel = 'Fuel required';
      }
      break;
    case 3:
      if (!values.engine ) {
        errors.engine = 'Engine required';
      }
    
      if (!values.doors ) {
        errors.doors = 'Doors required';
      }
    
      if (!values.seats ) {
        errors.seats = 'Seats required';
      }
    
      if (!values.driver_side) {
        errors.driver_side = 'Driver side required';
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
