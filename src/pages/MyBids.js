import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { refreshMyVehicles, refreshDisplayPrices, updatePrefferedCurrency, fetchAllData } from '../redux/data/dataActions';
import { convertToDisplayCurrency } from '../utils/PricesCoinsExchange';


const MyBids = () => {

    const dispatch = useDispatch();
    const data = useSelector((state) => state.data);
    const blockchain = useSelector((state) => state.blockchain);


    async function withdrawBid(id) {
        blockchain.smartContract.methods
            .withdrawBid(id)
            .send({ from: blockchain.account })
            .once("error", (err) => {
                console.log(err);
            })
            .then((receipt) => {
                console.log(receipt);
                dispatch(fetchAllData(blockchain.account));
            });
    }
    
    return (
        <div>
          {data.loading ? (
            <p>loading...</p>
          ) : (
            data.myBids.map((nft, index) => {
                if (nft.hasOwnProperty('bid'))
                    return (
                        <div key={index}>
                          <p>Deleted Vehicle ID: {nft.id}</p>  
                        <p>YOUR BID: {nft.bid}</p>

                        <button onClick={(e) => {
                            e.preventDefault()
                            withdrawBid(nft.id)}}>
                                Withdraw Bid
                        </button>
                        </div>
                    );
                else
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
                  <p>YOUR BID: {nft.injected.bid}</p>
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

