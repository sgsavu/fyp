import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as s from "../styles/globalStyles";


function MyVehicles() {

  

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  

  return (
    <div className='MyVehicles'>
      <s.SpacerLarge />
          {data.loading ? (
            <>
              <s.SpacerSmall />
              <s.TextDescription style={{ textAlign: "center" }}>
                loading...
              </s.TextDescription>
            </>
          ) : (
            data.myTokensMetadata.map((nft, index) => {
              
              return (
                <s.Container key={index} style={{ padding: 16 }}>
                  <s.TextTitle>{nft.name}</s.TextTitle>
                  <s.TextTitle>{nft.description}</s.TextTitle>
                  <s.TextTitle>{nft.attributes[0].value}</s.TextTitle>
                  <s.TextTitle>{nft.name}</s.TextTitle>
                  <img
                    alt={nft.name}
                    src={nft.image}
                    width={150}
                  />
                
                </s.Container>
                
              );
            })
          )}
    </div>
  );
}

export default MyVehicles;