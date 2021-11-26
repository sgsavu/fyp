import web3 from "web3";
import store from "../redux/store";

export const WeiToEth = (amount) => {
    return web3.utils.fromWei(String(amount), 'ether')
}

export const EthToWei = (amount) => {
    return web3.utils.toWei(String(amount), 'ether')
}

export const fetchRate = async (toCurrency, fromCurrency) => {
    const CONSTRUCTED_LINK = new URL("https://min-api.cryptocompare.com/data/price");
    CONSTRUCTED_LINK.searchParams.append("fsym", toCurrency);
    CONSTRUCTED_LINK.searchParams.append("tsyms", fromCurrency);
    const price = await (await fetch(CONSTRUCTED_LINK)).json();
    return price[fromCurrency]
}

export const currencyToCurrency = async (amount, fromCurrency, toCurrency) => {
    const rate = await fetchRate(toCurrency, fromCurrency)
    return amount / rate
}

export const weiToMyCurrency = async (price) => {
    
    let myPrefferedCurrency = await store
        .getState()
        .data.displayCurrency
    
    let princeInEth = WeiToEth(price)
    let priceInUserCurrency = await currencyToCurrency(princeInEth, "ETH", myPrefferedCurrency)
    
    return (Math.round(priceInUserCurrency * 100) / 100).toFixed(2)
}

export const myCurrencyToWei = async (price) => {

    let myPrefferedCurrency = await store
        .getState()
        .data.displayCurrency

    const priceInETH = await currencyToCurrency(price, myPrefferedCurrency, "ETH")
    const priceInWei = EthToWei(priceInETH)
    return priceInWei
}