import React, { useEffect, useState } from 'react';
import Filter from './Filter';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { refreshMyVehicles, refreshDisplayPrices, updatePrefferedCurrency } from '../redux/data/dataActions';

const MyBids = () => {

    const dispatch = useDispatch();
    const data = useSelector((state) => state.data);

    return (
        <div>
           {data.myBids.map((bid)=>{
               return (
                   <div key={bid.vehicle}>
                   <p>Your Bid{bid.amount}</p>
                   <Link to={{
                pathname: "/vehicle",
                state: { metadata: bid.vehicle },
              }}>
                <p>VIEW </p>
              </Link>
                   </div>
               )
           })}
        </div>

    );
}

export default MyBids;