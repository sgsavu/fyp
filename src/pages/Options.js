import React, { useEffect, useState } from 'react';
import Filter from './Filter';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { updatePrefferedCurrency } from '../redux/data/dataActions';

const Options = () => {

    const dispatch = useDispatch();
    const data = useSelector((state) => state.data);
    const availableCurrencies = ["GBP", "USD", "EUR", "ETH", "BTC"]

    useEffect(() => {
        console.log("mycurrency",data.currency)
    }, [dispatch,updatePrefferedCurrency])

    return (
        <div>
            Preffered Currency:
            <select onChange={(e) => {
                dispatch(updatePrefferedCurrency(e))
            }}> <option value={data.currency}>{data.currency}</option>
                {availableCurrencies.map((currency) => {
                    if (currency!=data.currency)
                    return (
                        <option key={currency} value={currency}>{currency}</option>
                    );
                })}
            </select>
        </div>

    );
}

export default Options;