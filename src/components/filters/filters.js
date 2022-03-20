import { getUserAccount } from "../../redux/reduxUtils";

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

export function specialSort(list) {

    list.sort(async (a, b) => { 
        var valueA = (a.injected.topBidder == await getUserAccount())? true : false
        var valueB = (b.injected.topBidder == await getUserAccount())? true : false
        return (valueA === valueB) ? 0 : valueA ? -1 : 1; 
    })
    list.sort(async (a, b) => { 
        var valueA = (a.injected.owner == await getUserAccount())? true : false
        var valueB = (b.injected.owner == await getUserAccount())? true : false
        return (valueA === valueB) ? 0 : valueA ? -1 : 1; 
    })
    return list
}

export function filterPriceRange(list, minPrice, maxPrice) {
    return list.filter((element) => {
        if (element.injected.display_price > minPrice && element.injected.display_price < maxPrice)
            return true
        else
            return false
    })
}

export function filterByPropertyExistence(list, property) {
    return list.filter((element) => {
        return element.injected.hasOwnProperty(property);
    });
}

export function filterByPropertyValue(list, property, value) {

        return list.filter((element) => {
            return element.injected[property] == value;
        });
}


export function filterByFilterObject(obj, list, acc) {

    if (Object.keys(obj).length != 0) {

        var temp = list
        
        if (obj.hasOwnProperty("show")) {
            temp = filterByPropertyValue(temp, obj.show, acc)
        }

        if (obj.hasOwnProperty("type")) {
            if (obj.type == "instant")
            {
                temp = filterByPropertyValue(temp, "auction", false)
            }
            else if (obj.type == "auction") {
                temp = filterByPropertyValue(temp, "auction", true)
            }
        }

        temp = temp.filter((element) => {
            for (var elz of Object.keys(obj)) {
                if (element.attributes.hasOwnProperty(elz) && obj[elz] != element.attributes[elz])
                    return false
            }
            return true
        })

        if (obj.hasOwnProperty("price")) {
            sortBy(temp, obj.price)
        }


        return temp

    } else {

        return list
    }


}