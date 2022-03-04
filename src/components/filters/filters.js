export function sortBy(list, sortType) {
    switch (sortType) {
        case "ascending":
            list.sort((a, b) => (a.injected.price > b.injected.price) ? 1 : -1)
            break;
        case "descending":
            list.sort((a, b) => (a.injected.price < b.injected.price) ? 1 : -1)
            break;
    }
    return list
}

export function filterByInjectedValue(field, value, list) {
    return list.filter((element) => {
        return element.injected[field] == value
    });
}

export function filterByFilterObject(obj, list) {
    return list.filter((element) => {
        for (var elz of Object.keys(obj))
        {
            if (obj[elz]!=element.attributes[elz])
                return false
        }
        return true
    })
}