import web3 from "web3";
import store from "../redux/store";

export const convertWeiToEth = (amount) => {
    return web3.utils.fromWei(String(amount), 'ether')
}

export const convertEthToWei = (amount) => {
    return web3.utils.toWei(String(amount), 'ether')
}

export const fetchRate = async (toCurrency, fromCurrency) => {
    const CONSTRUCTED_LINK = new URL("https://min-api.cryptocompare.com/data/price");
    CONSTRUCTED_LINK.searchParams.append("fsym", toCurrency);
    CONSTRUCTED_LINK.searchParams.append("tsyms", fromCurrency);
    const price = await (await fetch(CONSTRUCTED_LINK)).json();
    return price[fromCurrency]
}

export const convertCurrencyToCurrency = async (amount, fromCurrency, toCurrency) => {
    const rate = await fetchRate(toCurrency, fromCurrency)
    return amount / rate
}

export const priceToUserCurrency = async (price) => {
    let myPrefferedCurrency = await store
        .getState()
        .data.currency
    let princeInEth = convertWeiToEth(price)
    let priceInUserCurrency = await convertCurrencyToCurrency(princeInEth, "ETH", myPrefferedCurrency)
    return (Math.round(priceInUserCurrency * 100) / 100).toFixed(2)
}