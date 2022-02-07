export function sorting(list, sortType) {
    switch (sortType) {
        case "newest":
            list.sort((a, b) => (a.nonce > b.nonce) ? 1 : -1)
            break;
        case "oldest":
            list.sort((a, b) => (a.nonce > b.nonce) ? 1 : -1)
            break;
        case "alphabetically":
            list.sort((a, b) => (a.nonce > b.nonce) ? 1 : -1)
            break;
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

export function filterByAttributeValue(field, value, list) {
    return list.filter((element) => {
        return element.attributes[field] == value
    });
}