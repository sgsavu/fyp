import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SearchFilter from '../filters/SearchFilter';
import SortFilter from "../filters/SortFilter";
import VehicleCard from "../vehicle_sections/VehicleCard";



const Marketplace = () => {

  const data = useSelector((state) => state.data);

  const [pageType, setPageType] = useState("instant");
  let vehicleList = data.saleVehicles[pageType];
  const [perPage, setPerPage] = useState(10);
  const [pageNr, setPageNr] = useState(0)
  const myPrefferedCurrency = data.displayCurrency
  const [filtered, setFiltered] = useState([]);
  const [filteredPages, setPages] = useState([]);

  const nextPage = () => {
    if (pageNr != filteredPages.length - 1)
      setPageNr(pageNr + 1)
  }

  const prevPage = () => {
    if (pageNr != 0)
      setPageNr(pageNr - 1)
  }

  function splitIntoPages(filtered) {
    const copy = Object.values(filtered).filter(() => true);
    var temp = []
    while (copy.length) {
      temp = [...temp, copy.splice(0, perPage)]
    }
    setPages(temp)
  }

  useEffect(() => {
    if (vehicleList != undefined) {
      splitIntoPages(vehicleList)
      setFiltered(vehicleList)
    }
  }, [vehicleList,data])

  useEffect(() => {
    splitIntoPages(filtered)
  }, [filtered, setFiltered])


  return (
    <div>
      <div>
        <button onClick={() => {
          setPageType("instant")
        }}>INSTANT BUY</button>
        <button onClick={() => {
          setPageType("auctions")
        }}>AUCTIONS</button>
        <SearchFilter in={vehicleList} out={setFiltered} default={vehicleList} />
        <SortFilter in={filtered} out={splitIntoPages} />
        <div>
          {filteredPages.length != 0 ? filteredPages[pageNr].map((vehicle, key) => {
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