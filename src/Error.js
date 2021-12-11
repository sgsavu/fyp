import React, { useEffect } from "react";
import './styles/App.css';
import { useDispatch, useSelector } from "react-redux";





function Error() {

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);

  useEffect(() => {
    
    
  }, []);

  const reload = () =>{
    window.location.reload();
  }

  return (
    <div>
      {blockchain.errorMsg}
      <button onClick={reload}>Return Home</button>
    </div>
  );
}

export default Error;