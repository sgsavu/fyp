import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./Modal";
import { alerts } from "../../redux/app/appActions";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

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
          Transaction successful!
          {app.alerts.other.at(-1).url? <a href={app.alerts.other.at(-1).url} target="_blank">View 🔗</a> : null }
        </Alert>
      </Snackbar> : null
  );
}

export default CustomModal;