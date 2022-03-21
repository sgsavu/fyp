import React from "react";
import { useSelector } from "react-redux";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function Loading() {

  const app = useSelector((state) => state.app);

  /**
  * The loading modal which happens when the store value of loading is not empty.
  */
  return (
    app.alerts.loading.length != 0 ?
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop> : null
  );
}

export default Loading;