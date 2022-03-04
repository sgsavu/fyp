import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import VehicleCard from "../vehicle_sections/VehicleCard";
import { filterByFilterObject, filterByInjectedValue, sortBy } from "../filters/filters";
import SearchFilter from "../filters/SearchFilter";
import { findKeyOfValueInObj, grabAllValuesFromObject, isValueInObject, listToNSublists } from "../utils/Other";


const Marketplace = () => {

  const data = useSelector((state) => state.data);
  const [pageType, setPageType] = useState("instant");
  let vehicleList = data.saleVehicles[pageType];
  const [perPage, setPerPage] = useState(10);
  const [pageNr, setPageNr] = useState(0)
  const [pages, setPages] = useState([]);
  const [sortType, setSortType] = useState("ascending")

  const [filterObject, setFilterObject] = useState([])

  const [pool, setPool] = useState([])
  const [backupPool, setBackupPool] = useState([])

  const [allAttributes, setAllAttributes] = useState([])
  const [allValues, setAllValues] = useState([])

  const nextPage = () => {
    if (pageNr != pages.length - 1)
      setPageNr(pageNr + 1)
  }

  const prevPage = () => {
    if (pageNr != 0)
      setPageNr(pageNr - 1)
  }

  function newCopy(list) {
    const copy = list.filter(() => true);
    return copy
  }

  function splitIntoPages(list) {

    var listOfVehicles = newCopy(list)

    listOfVehicles = filterByFilterObject(filterObject, listOfVehicles)

    const filter2 = sortBy(listOfVehicles, sortType)

    setPages(listToNSublists(filter2, perPage))
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


  useEffect(() => {
    splitIntoPages(pool)
  }, [pool, sortType, filterObject])




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

    <div>
      <div>
        <button onClick={() => {
          setPageType("instant")
        }}>INSTANT BUY</button>
        <button onClick={() => {
          setPageType("auctions")
        }}>AUCTIONS</button>


        <SearchFilter pool={pool} modifier={setPool} reset={backupPool} />

        <select multiple onChange={(e) => { loadFilterObject(getSelectValues(e.target)) }}>
          {allValues.map((element, index) => {
            if (!(findKeyOfValueInObj(element, allAttributes) in filterObject) || isValueInObject(element, filterObject))
              return <option key={index} value={"{\"" + findKeyOfValueInObj(element, allAttributes) + "\"" + ":" + "\"" + element + "\"}"}>{element}</option>
          })}
        </select>

        <select onChange={(e) => setSortType(e.target.value)}>
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
        </select>


        <div>
          {pages.length != 0 ? pages[pageNr].map((vehicle, key) => {
            return (
              <VehicleCard key={key} vehicle={vehicle}></VehicleCard>
            );
          }) : <p>No vehicles available.</p>}
        </div>
        <button onClick={prevPage}>Prev</button>
        <p>{pageNr + 1}</p>
        <button onClick={nextPage}>Next</button>
      </div>
    </div>
  );


}

export default Marketplace;