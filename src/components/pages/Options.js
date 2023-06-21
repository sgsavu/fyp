import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { refreshDisplayPrices, updatePrefferedCurrency } from '../../redux/data/dataActions';
import { fetchAllCurrencies } from '../utils/Exchange';

const Options = () => {

    const dispatch = useDispatch();
    const data = useSelector((state) => state.data);
    const cryptoCurrencies = [{id:"ETH"},{id:"BTC"}]
    const [availableCurrencies, setAvailableCurrencies] = useState([])

    useEffect(async () => {
        setAvailableCurrencies(cryptoCurrencies.concat(await fetchAllCurrencies()))
    }, [])

    async function changeAppCurrency(e) {
        dispatch(updatePrefferedCurrency(e.target.value))
        dispatch(refreshDisplayPrices())
    }

    return (
        <div>
            Currency:
            <select value={data.displayCurrency} onChange={changeAppCurrency}>
                {availableCurrencies.map((currency) => {
                    return (
                        <option key={currency.id} value={currency.id}>{currency.id}</option>
                    );
                })}
            </select>
        </div>

    );
}

export default Options;