import React, { useEffect, useState } from 'react';
import Filter from './Filter';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { refreshMyVehicles, refreshDisplayPrices, updatePrefferedCurrency } from '../redux/data/dataActions';

const Options = () => {

    const dispatch = useDispatch();
    const data = useSelector((state) => state.data);
    const myCurrency = data.displayCurrency
    const availableCurrencies = ["GBP", "USD", "EUR", "ETH", "BTC"]

    return (
        <div>
            Preffered Currency:
            <select onChange={(e) => {
                dispatch(updatePrefferedCurrency(e))
                dispatch(refreshDisplayPrices(e))
            }}> <option value={myCurrency}>{myCurrency}</option>
                {availableCurrencies.map((currency) => {
                    if (currency!=myCurrency)
                    return (
                        <option key={currency} value={currency}>{currency}</option>
                    );
                })}
            </select>
        </div>

    );
}

export default Options;