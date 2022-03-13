import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { refreshMyVehicles, refreshDisplayPrices, updatePrefferedCurrency } from '../../redux/data/dataActions';

const Options = () => {

    const dispatch = useDispatch();
    const data = useSelector((state) => state.data);
    const myCurrency = data.displayCurrency
    const availableCurrencies = ["GBP", "USD", "EUR", "ETH", "BTC"]


    function changeAppCurrency(e) {
        dispatch(updatePrefferedCurrency(e.target.value))
        dispatch(refreshDisplayPrices(e))
    }

    return (
        <div>
            Currency: 
            <select defaultValue={myCurrency} onChange={changeAppCurrency}>
                {availableCurrencies.map((currency) => {
                    return (
                        <option key={currency} value={currency}>{currency}</option>
                    );
                })}
            </select>
        </div>

    );
}

export default Options;