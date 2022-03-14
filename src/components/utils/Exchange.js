import web3 from "web3";
import store from "../../redux/store";

export const WeiToEth = (amount) => {
    return web3.utils.fromWei(String(amount), 'ether')
}


export const fetchAllCurrencies = async () => {
    const request = new URL("https://api.coinbase.com/v2/currencies");
    const response = await (await fetch(request)).json();
    return response.data
}

export const EthToWei = (amount) => {
    return web3.utils.toWei(String(amount), 'ether')
}

export function roundToNDigits(digits,num) {
    return +(Math.round(num + `e+${digits}`) + `e-${digits}`);
}


export const fetchRate = async (from, to) => {
    var request = new URL("https://api.coinbase.com/v2/prices/" + from + "-" + to + "/spot");
    var response = await (await fetch(request)).json();
    if (response.hasOwnProperty("errors")) {
        request = new URL("https://api.coinbase.com/v2/prices/" + to + "-" + from + "/spot");
        response = await (await fetch(request)).json();
        return 1/parseFloat(response.data.amount)
    }
    return parseFloat(response.data.amount)
}

export const currencyToCurrency = async (amount, from, to) => {
    const rate = await fetchRate(from, to)
    return amount * rate
}

export const weiToMyCurrency = async (price) => {

    let myPrefferedCurrency = await store
        .getState()
        .data.displayCurrency

    let priceInETH = WeiToEth(price)
        
    if (myPrefferedCurrency == "ETH")
        return parseFloat(priceInETH)

    if (myPrefferedCurrency == "BTC")
    {
        var price1 = await currencyToCurrency(priceInETH, "ETH", "USD")
        var price2 = await currencyToCurrency(price1, "USD", "BTC")
        return roundToNDigits(5,price2)
    }

    let priceInUserCurrency = await currencyToCurrency(priceInETH, "ETH", myPrefferedCurrency)

    if (myPrefferedCurrency == "BTC")
        return roundToNDigits(5,priceInUserCurrency)

    return roundToNDigits(2,priceInUserCurrency)
}

export const myCurrencyToWei = async (price) => {

    let myPrefferedCurrency = await store
        .getState()
        .data.displayCurrency

    const priceInETH = await currencyToCurrency(price, myPrefferedCurrency, "ETH")
    const priceInWei = EthToWei(priceInETH)
    return priceInWei
}