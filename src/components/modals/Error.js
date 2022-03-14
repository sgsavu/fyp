import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { alerts } from "../../redux/app/appActions";

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function Error() {

  const dispatch = useDispatch();
  const app = useSelector((state) => state.app);


  const dismiss = () => {
    dispatch(alerts({ alert: "error" }))
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    dismiss();
  };

  return (
    app.alerts.error.length != 0 ?
      <Snackbar open={true} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {app.alerts.error.length}. Error! {app.alerts.error.at(-1)}
        </Alert>
      </Snackbar> : null
  );
}

export default Error;