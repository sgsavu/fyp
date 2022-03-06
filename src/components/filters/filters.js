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

export function filterPriceRange(list,minPrice,maxPrice) {
    return list.filter((element) => {
        if  (element.injected.display_price>minPrice && element.injected.display_price<maxPrice )
            return true
        else
            return false
    })
}

export function filterByPropertyExistence(list,property) {
    return list.filter((element) => {
        return element.injected.hasOwnProperty(property);
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