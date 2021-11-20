import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Filter from './Filter';
import { priceToUserCurrency } from "./PricesCoinsExchange";




const Marketplace = () => {

  const data = useSelector((state) => state.data);
  const vehicleList = data.vehiclesForSale
  const [perPage, setPerPage] = useState(10);
  const [pageNr, setPageNr] = useState(0)
  const myPrefferedCurrency = data.displayCurrency
  const [filteredPages, setFilteredPages] = useState([]);

  const nextPage = () => {
    if (pageNr != filteredPages.length-1)
    setPageNr(pageNr + 1)
  }

  const prevPage = () => {
    if (pageNr != 0)
      setPageNr(pageNr - 1)
  }

  function listToPages(filtered) {
    const copy = filtered.filter(element => element);
    var temp = []
    while (copy.length) {
      temp = [...temp, copy.splice(0, perPage)]
    }
    setFilteredPages(temp)
  }

  useEffect(() => {
    listToPages(vehicleList)
  }, [vehicleList])

  return (
    <div>
      {data.loading? null: 
    <div>
      <Filter data={vehicleList} callback={listToPages} empty_state={vehicleList} />
      <div>
        {filteredPages.length != 0 ? filteredPages[pageNr].map((vehicle, key) => {
          return (
            <div key={key}>
              <a ></a>
              <p>{vehicle.name}</p>
              <p>{vehicle.description}</p>
              <p>{vehicle.attributes[1].value}</p>
              <img alt={vehicle.name} src={vehicle.image} width={150}></img>
              <Link to={{
                pathname: "/vehicle",
                state: { metadata: vehicle },
              }}>
              <p>VIEW </p>
              </Link>
              <p>{
               vehicle?.injected.display_price 
              } {myPrefferedCurrency}</p>
            </div>
          );
        }) : null}
      </div>
      <button onClick={prevPage}>Prev</button>
      <p>{pageNr+1}</p>
      <button onClick={nextPage}>Next</button>
    </div>
    }
    </div>
  );


}

export default Marketplace;