import React from "react";
import '../../styles/Loading2.css';
import '../../styles/Loading4.css';
import { useSelector } from "react-redux";
import Modal from "./Modal";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function Loading() {

  const app = useSelector((state) => state.app);

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