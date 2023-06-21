import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { alerts } from "../../redux/app/appActions";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

/**
  * The main modal/snackbar displayed at the bottom when any success happens
  * It is handled in a last in first out system (check blockchain reducer) in order
  * to store order of the modals.
  */
function CustomModal() {

  const dispatch = useDispatch();
  const app = useSelector((state) => state.app);


  const dismiss = () => {
    dispatch(alerts({ alert: "other" }))
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    dismiss();
  };

  return (
    app.alerts.other.length != 0 ?
      <Snackbar open={true} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          {app.alerts.other.at(-1).message} 
          {app.alerts.other.at(-1).url ? <a href={app.alerts.other.at(-1).url} target="_blank">View 🔗</a> : null}
        </Alert>
      </Snackbar> : null
  );
}

export default CustomModal;