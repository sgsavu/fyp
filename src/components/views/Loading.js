import React from "react";
import '../../styles/App.css';
import { useSelector } from "react-redux";

function Loading() {

  const blockchain = useSelector((state) => state.blockchain);

  return (
    <div>
      <p>Loading: {blockchain.loading[blockchain.loading.length-1]}</p>
    </div>
  );
}

export default Loading;