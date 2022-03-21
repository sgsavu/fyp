export function findKeyOfValueInObj(theValue, obj) {
    for (const [key, value] of Object.entries(obj)) {
        if (value.includes(theValue))
            return key
    }
}

/**
 * Grabs all of the values from a nested object's values and puts them in a list
 * @param obj the obj for which we wish to extract all of its values
 */
export function grabAllValuesFromObject(obj) {
    var allValues = []
    for (var i = 0; i < Object.values(obj).length; i++) {
        for (var element of Object.values(obj)[i]) {
            allValues.push(element)
        }
    }
    return allValues
}

export function isValueInObject(value, obj) {
    for (const element of Object.values(obj)) {
        if (element.includes(value))
            return true
    }
    return false
}

/**
 * Splits a list to n subsequent lists
 * @param list the list we wish to split
 * @param n the number of sublists we wish to have
 * @returns {List} the list of sublists
 */
export function listToNSublists(list, n) {
    var sublists = []
    while (list.length) {
        sublists = [...sublists, list.splice(0, n)]
    }
    return sublists
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculates the greatest common divisor
 * @param a first number
 * @param b second number
 * @returns {Number} the greatest common divisor
 */
export function gcd(a, b) {
    if (b == 0) {
        return a
    }
    return gcd(b, a % b)
}

/**
 * Formats the address provided and shortens it to allow for space
 * restrictions.
 * @param address the address we wish to shorten
 * @returns {String} the formatted address
 */
export function formatAccountAddress(address) {
    if (address) {
        var length = address.length
        return address.slice(0, 6) + "..." + address.slice(length - 4, length)
    }
}