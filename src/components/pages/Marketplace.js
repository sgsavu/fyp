import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import VehicleCard from "../vehicle_sections/MiniCard";
import { filterByFilterObject, filterByInjectedValue, filterByPropertyExistence, filterPriceRange, sortBy } from "../filters/filters";
import SearchFilter from "../filters/Search";
import { findKeyOfValueInObj, grabAllValuesFromObject, isValueInObject, listToNSublists } from "../utils/Other";
import '../../styles/Marketplace.css';


const Marketplace = () => {

  const data = useSelector((state) => state.data);
  const [pageType, setPageType] = useState("instant");
  let vehicleList = data.saleVehicles[pageType];

  const [pageNr, setPageNr] = useState(0)
  const [pages, setPages] = useState([]);

  const [pool, setPool] = useState([])
  const [backupPool, setBackupPool] = useState([])

  const [allAttributes, setAllAttributes] = useState([])
  const [allValues, setAllValues] = useState([])
  const [filterObject, setFilterObject] = useState([])

  const [minPrice, setMinPrice] = useState(50)
  const [maxPrice, setMaxPrice] = useState(10000)
  const [perPage, setPerPage] = useState(10);
  const [sortType, setSortType] = useState("ascending")
  const [filterByProperty, setFilterByProperty] = useState("id")

  function newCopy(list) {
    const copy = list.filter(() => true);
    return copy
  }




  function getAttributesCollection(listOfVehicles) {
    var collection = {
      "company": [],
      "model": [],
      "vhcid": [],
      "year": [],
      "color": [],
      "body": [],
      "transmission": [],
      "fuel": [],
      "engine": [],
      "doors": [],
      "seats": [],
      "driver_side": []
    }
    for (var vehicle of listOfVehicles) {
      for (const [key, value] of Object.entries(vehicle.attributes)) {
        if (!collection[key].includes(value)) {
          collection[key].push(value)
        }
      }
    }
    return collection
  }


  useEffect(() => {
    if (vehicleList != undefined) {
      setPool(Object.values(vehicleList))
      setBackupPool(newCopy(Object.values(vehicleList)))

      var allAttributes = getAttributesCollection(Object.values(vehicleList))
      setAllAttributes(allAttributes)
      setAllValues(grabAllValuesFromObject(allAttributes))

    }
  }, [vehicleList, data.saleVehicles])



  function applyFilters(list) {

    var listOfVehicles = newCopy(list)
    listOfVehicles = filterByPropertyExistence(listOfVehicles, filterByProperty)
    listOfVehicles = filterByFilterObject(filterObject, listOfVehicles)
    listOfVehicles = filterPriceRange(listOfVehicles, minPrice, maxPrice)
    listOfVehicles = sortBy(listOfVehicles, sortType)
    listOfVehicles = listToNSublists(listOfVehicles, perPage)
    return listOfVehicles
  }

  useEffect(() => {
    setPages(applyFilters(pool))
  }, [pool, sortType, filterObject, minPrice, maxPrice, perPage, filterByProperty])



  function loadFilterObject(list) {
    var mf = {}
    for (var i = 0; i < list.length; i++)
      mf[Object.keys(list[i])[0]] = Object.values(list[i])[0]
    setFilterObject(mf)
  }


  function getSelectValues(select) {
    var result = [];
    var options = select && select.options;
    var opt;
    for (var i = 0, iLen = options.length; i < iLen; i++) {
      opt = options[i];
      if (opt.selected) {
        result.push(JSON.parse(opt.value));
      }
    }
    return result;
  }

  return (

    <div className="marketplace-main">
      <div>

        <div className="center">
          <button onClick={() => {
            setPageType("instant")
          }}>INSTANT BUY</button>
          <button onClick={() => {
            setPageType("auctions")
          }}>AUCTIONS</button>
        </div>

        <div className="center">
          <select multiple onChange={(e) => { loadFilterObject(getSelectValues(e.target)) }}>
            {allValues.map((element, index) => {
              if (!(findKeyOfValueInObj(element, allAttributes) in filterObject) || isValueInObject(element, filterObject))
                return <option key={index} value={"{\"" + findKeyOfValueInObj(element, allAttributes) + "\"" + ":" + "\"" + element + "\"}"}>{element}</option>
            })}
          </select>
        </div>




        <div className="center">
          <label>Show:</label>
          <select onChange={(e) => setFilterByProperty(e.target.value)}>
            <option selected value="id">
              Default
            </option>
            {pageType == "auctions" ? <option value="bid">
              My Bids
            </option> : null}
            <option selected value="mine">
              My Listings
            </option>
          </select>
          <label>Sort:</label>
          <select onChange={(e) => setSortType(e.target.value)}>
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
          </select>
          <label>Per page:</label>
          <select onChange={(e) => setPerPage(e.target.value)}>
            <option value={5}>
              5
            </option>
            <option value={15}>
              15
            </option>
            <option value={25}>
              25
            </option>
          </select>
        </div>

        <div>
          <label>Min Price: {minPrice}</label>
        </div>

        <div>
          <input onInput={(e) => setMinPrice(e.target.value)} type="range" min="1" max="10000" value={minPrice} ></input>
        </div>

        <div>
          <label>Max Price: {maxPrice}</label>
        </div>

        <div>
          <input onInput={(e) => setMaxPrice(e.target.value)} type="range" min="1" max="10000" value={maxPrice}></input>
        </div>


        <div className="center">
          <SearchFilter pool={pool} modifier={setPool} reset={backupPool} />
        </div>


        <div className="cards">
          {pages.length != 0 ? pages[pageNr].map((vehicle, key) => {
            return (
              <VehicleCard key={key} vehicle={vehicle}></VehicleCard>
            );
          }) : <p className="center">No vehicles available.</p>}
        </div>

        <div className="paging">
          <button disabled={pageNr != 0 ? false : true} onClick={() => setPageNr(pageNr - 1)}>🡠</button>
          {pages.map((page, index) => {
            return (
              <button disabled={pageNr == index ? true : false} key={index}>
                {index + 1}
              </button>
            );
          })}
          <button disabled={pageNr != pages.length - 1 ? false : true} onClick={() => setPageNr(pageNr + 1)}>🡢</button>
        </div>


      </div>
    </div>
  );


}

export default Marketplace;