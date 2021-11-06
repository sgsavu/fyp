import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../redux/blockchain/blockchainActions";
import { fetchData } from "../redux/data/dataActions";
import * as s from "../styles/globalStyles";
import styled from "styled-components";

function Marketplace() {

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [NFTS, setNFTS] = useState([]);

    if (false)
  return (
    <div className='Marketplace'>
      <h1>Marketplace</h1>
    </div>
  );
  else
  return (
    <div className='Marketplace2'>
      <s.SpacerLarge />
          {data.loading ? (
            <>
              <s.SpacerSmall />
              <s.TextDescription style={{ textAlign: "center" }}>
                loading...
              </s.TextDescription>
            </>
          ) : (
            data.forSaleTokensMetadata.map((nft, index) => {
              
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

export default Marketplace;