import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import VehicleCard from "../vehicle_sections/VehicleCard";
import { filterByAttributeValue, filterByInjectedValue, sorting } from "../filters/filters";
import SearchFilter from "../filters/SearchFilter";


const Marketplace = () => {

  const data = useSelector((state) => state.data);
  const [pageType, setPageType] = useState("instant");
  let vehicleList = data.saleVehicles[pageType];
  const [perPage, setPerPage] = useState(10);
  const [pageNr, setPageNr] = useState(0)
  const [pages, setPages] = useState([]);
  const [sortType, setSortType] = useState("ascending")

  const [multipleFilter, setMultipleFilter] = useState([])
  const [multipleFilter2, setMultipleFilter2] = useState([])

  const [pool, setPool] = useState([])
  const [backupPool, setBackupPool] = useState([])

  const nextPage = () => {
    if (pageNr != pages.length - 1)
      setPageNr(pageNr + 1)
  }

  const prevPage = () => {
    if (pageNr != 0)
      setPageNr(pageNr - 1)
  }


  function splitIntoPages(list) {

    var copy = createCopy(list)

    multipleFilter.forEach((obj) => {
      copy = filterByAttributeValue(Object.keys(obj)[0], obj[Object.keys(obj)[0]], copy)
    })


    const filter2 = sorting(copy, sortType)

    var pages = []
    while (filter2.length) {
      pages = [...pages, filter2.splice(0, perPage)]
    }
    setPages(pages)
  }

  function createCopy(list) {
    const copy = list.filter(() => true);
    return copy
  }

  useEffect(() => {
    if (vehicleList != undefined) {
      setPool(Object.values(vehicleList))
      setBackupPool(createCopy(Object.values(vehicleList)))
    }
  }, [vehicleList, data])


  useEffect(() => {
  }, [useSelector((state) => state.data).saleVehicles])


  useEffect(() => {
    splitIntoPages(pool)
  }, [pool, sortType, multipleFilter])


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


  function checkIfTypePresent(list, object) {
    for (var i = 0; i < list.length; i++) {
      if (object in list[i])
        return true
    }
    return false
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

        <select multiple onChange={(e) => { setMultipleFilter(getSelectValues(e.target)) }}>
          <option value='{"company":"Tesla"}'>
            Company: Tesla
          </option>
          {checkIfTypePresent(multipleFilter,"company")? null : 
            
            <option value='{"company":"Ford"}'>
              Company: Ford
            </option>}

          <option value='{"model":"X"}'>
            Model: X
          </option>
          <option value='{"model":"Y"}'>
            Model: Y
          </option>
        </select>


        <div>
          {pages.length != 0 ? pages[pageNr].map((vehicle, key) => {
            return (
              <VehicleCard key={key} vehicle={vehicle}></VehicleCard>
            );
          }) : <p>{pageType == "instant" ? "No vehicles are currently available for sale by instant buy." : "No vehicles are currently available for sale by auction."}</p>}
        </div>

        <button onClick={prevPage}>Prev</button>
        <p>{pageNr + 1}</p>
        <button onClick={nextPage}>Next</button>
      </div>
    </div>
  );


}

export default Marketplace;