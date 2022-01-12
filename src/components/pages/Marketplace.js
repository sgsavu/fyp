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
  const [sortType, setSortType] = useState("descending")

  const nextPage = () => {
    if (pageNr != pages.length - 1)
      setPageNr(pageNr + 1)
  }

  const prevPage = () => {
    if (pageNr != 0)
      setPageNr(pageNr - 1)
  }

  const [pool, setPool] = useState([])
  const [backupPool, setBackupPool] = useState([])

  

  function splitIntoPages(list) {
    const copy = createCopy(list)
    //const filter1 = filterByAttributeValue("company","213451235",copy)
    const filter2 = sorting(copy,sortType)
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
  }, [vehicleList])

  useEffect(() => {
    splitIntoPages(pool)
  }, [pool])

  return (
    <div>
      <div>
        <button onClick={() => {
          setPageType("instant")
        }}>INSTANT BUY</button>
        <button onClick={() => {
          setPageType("auctions")
        }}>AUCTIONS</button>

        <SearchFilter pool={pool} modifier={setPool} reset={backupPool}/>

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