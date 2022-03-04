export function findKeyOfValueInObj(theValue, obj) {
    for (const [key, value] of Object.entries(obj)) {
        if (value.includes(theValue))
            return key
    }
}

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

export function listToNSublists(list, n) {
    var sublists = []
    while (list.length) {
      sublists = [...sublists, list.splice(0, n)]
    }
    return sublists
  }