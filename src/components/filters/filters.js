import { getUserAccount } from "../../redux/reduxUtils";

/**
  * Sorts a list by ascending or descending price
  * @param list the list we wish to sort
  * @param sortType the type of sort
  */
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

/**
  * THis function sorts the list to always display the vehicles which you are
  * an owner of and the ones on which you have bidded.
  * @param list the list we wish to sort
  */
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

/**
  * Filter a list so that each element fits between a min price and a max price
  * @param list the list we wish to sort
  * @param minPrice the minimum price
  * @param maxPrice the maximum price
  */
export function filterPriceRange(list, minPrice, maxPrice) {
    return list.filter((element) => {
        if (element.injected.display_price > minPrice && element.injected.display_price < maxPrice)
            return true
        else
            return false
    })
}

/**
  * this function filters a list by the existence of a property for 
  * each element in the list
  * @param list the list we wish to filter
  * @param property the property we are filter for
  */
export function filterByPropertyExistence(list, property) {
    return list.filter((element) => {
        return element.injected.hasOwnProperty(property);
    });
}

/**
  * Filter a list by the value of a certain property
  * @param list the list we are filtering
  * @param property the property we are evaluationg
  * @param value the value for the property
  */
export function filterByPropertyValue(list, property, value) {

        return list.filter((element) => {
            return element.injected[property] == value;
        });
}


/**
  * Filters a list by a filtering object. It filters objects
  * which only abide by the pattern the obj dictates
  * @param obj the filtering object
  * @param list the list we are filtering
  * @param acc the account for the user
  */
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