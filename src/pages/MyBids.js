import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { weiToMyCurrency } from '../utils/PricesCoinsExchange'


const MyBids = () => {

    const dispatch = useDispatch();
    const data = useSelector((state) => state.data);
    const blockchain = useSelector((state) => state.blockchain);
    
    console.log(data.myBids)

    return (
        <div>
          {data.loading ? (
            <p>loading...</p>
          ) : (
            data.myBids.map((nft, index) => {
              return (
                <div key={index} className="my-vehicle">
                  <p>{nft.name}</p>
                  <p>{nft.description}</p>
                  <p>{nft.attributes[0].value}</p>
                  <p>{nft.name}</p>
                  <img
                    alt={nft.name}
                    src={nft.image}
                    width={150}
                  /> 
                  <p>YOUR BID: {nft.injected.bid} WEI</p>
                  <Link to={{
                    pathname: "/vehicle",
                    state: { metadata: nft },
                  }}>
                    <p>VIEW </p>
                  </Link>
                </div>
              );
            })
          )}
        </div>
      );
}

export default MyBids;

