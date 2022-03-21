import web3 from "web3";
import store from "../../redux/store";

export const WeiToEth = (amount) => {
    return web3.utils.fromWei(String(amount), 'ether')
}

/**
 * Grabs a list of all official currencies from the COINBASE API
 * @returns {String} the list of all currencies in the world
 */
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

/**
 * Finds the exchange rate between 2 currencies
 * @param from the currency we wish to convert from
 * @param to the currecy we wish to convert to
 */
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

/**
 * Returns the exchanged value from one currency to another
 * @param amount the amount of the from currency we wish to convert
 * @param from the currency we wish to convert from
 * @param to the currecy we wish to convert to
 */
export const currencyToCurrency = async (amount, from, to) => {
    const rate = await fetchRate(from, to)
    return amount * rate
}

/**
 * Converts wei to the currency selected by the user as favorite in the app
 * @param price the price in wei we wish to convert to display currency
 */
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