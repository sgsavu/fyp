import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Filter from './Filter';




const Marketplace = () => {

  const data = useSelector((state) => state.data);
  const vehicleList = data.vehiclesForSale

  const [filteredPages, setFilteredPages] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [pageNr, setPageNr] = useState(0)


  const nextPage = () => {
    if (pageNr != filteredPages.length-1)
    setPageNr(pageNr + 1)
  }

  const prevPage = () => {
    if (pageNr != 0)
      setPageNr(pageNr - 1)
  }

  function filteredToPagesFiltered(filtered) {

    const copy = filtered.filter(element => element);
    var temp = []
    while (copy.length) {
      temp = [...temp, copy.splice(0, perPage)]
    }
    setFilteredPages(temp)
  }

  useEffect(() => {
    filteredToPagesFiltered(vehicleList)
  }, [])

  return (
    <div>
      <Filter data={vehicleList} callback={filteredToPagesFiltered} empty_state={vehicleList} />
      <div>
        {filteredPages.length != 0 ? filteredPages[pageNr].map((vehicle, key) => {
          return (
            <div key={key}>
              <a ></a>
              <p>{vehicle.name}</p>
              <p>{vehicle.description}</p>
              <p>{vehicle.attributes[1].value}</p>
              <img alt={vehicle.name} src={vehicle.image} width={150}></img>
            </div>
          );
        }) : null}
      </div>
      <button onClick={prevPage}>Prev</button>
      <p>{pageNr}</p>
      <button onClick={nextPage}>Next</button>
    </div>
  );


}

export default Marketplace;