import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SearchFilter from '../components/filters/SearchFilter';
import { priceToUserCurrency } from "../utils/PricesCoinsExchange";
import { getIfExists } from "../redux/blockchain/blockchainUtils";
import store from "../redux/store";
import SortFilter from "../components/filters/SortFilter";



const Marketplace = () => {

  const data = useSelector((state) => state.data);

  const [pageType, setPageType] = useState("instant");
  let vehicleList = data.vehiclesForSale[pageType];
  const [perPage, setPerPage] = useState(10);
  const [pageNr, setPageNr] = useState(0)
  const myPrefferedCurrency = data.displayCurrency
  const [filtered, setFiltered] = useState([]);
  const [filteredPages, setFilteredPages] = useState([]);

  const nextPage = () => {
    if (pageNr != filteredPages.length - 1)
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

  /*
  const checkIfStillExists = async (id) => {
    if (!await getIfExists(id))
      window.location.reload();
      window.location.replace("/")
  }

  */

  useEffect(() => {
    if (vehicleList != undefined)
    {
      listToPages(vehicleList)
      setFiltered(vehicleList)
    }
  }, [vehicleList])

  useEffect(() => {
      listToPages(filtered)
  }, [filtered,setFiltered])


  return (
    <div>
      {data.loading ? null :
        <div>
          <button onClick={() => {
            setPageType("instant")

          }}>INSTANT BUY</button>
          <button onClick={() => {
            setPageType("auctions")

          }}>AUCTIONS</button>
          <SearchFilter in={vehicleList} out={setFiltered} default={vehicleList} />
          <SortFilter in={filtered} out={listToPages}/>
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
                  <p>{pageType == "instant" ? "Price: " : "Highest Bid: "}{
                    vehicle?.injected.display_price
                  } {myPrefferedCurrency}</p>
                </div>
              );
            }) : <p>{pageType == "instant" ? "No vehicles are currently available for sale by instant buy." : "No vehicles are currently available for sale by auction."}</p>}
          </div>
          <button onClick={prevPage}>Prev</button>
          <p>{pageNr + 1}</p>
          <button onClick={nextPage}>Next</button>
        </div>
      }
    </div>
  );


}

export default Marketplace;