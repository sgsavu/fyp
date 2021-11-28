import React, { useState, useEffect, useMemo} from 'react';
import { useDispatch, useSelector } from "react-redux";

const SortFilter = ({ in: data, out: callback, default: dflt }) => {

    

    const handleFilter = (event) => {

        const sortType = event.target.value;
        var vehicles = data
        console.log(sortType)
        switch(sortType){
            case "off":
                vehicles.sort((a, b) => (a.injected.id > b.injected.id) ? 1 : -1)
                break;
            case "ascending":
                vehicles.sort((a, b) => (a.injected.price > b.injected.price) ? 1 : -1)
                break;
            case "descending":
                vehicles.sort((a, b) => (a.injected.price < b.injected.price) ? 1 : -1)
                break;
        }
        console.log("davehicles",vehicles)

        callback(vehicles) 
    }

    return (
        <div className="search">
            <div className="searchInputs">
                Price:
                <select id="cars" defaultValue="Saab" onChange={handleFilter}>
                    <option value="off">Off</option>
                    <option value="descending">Descending</option>
                    <option value="ascending">Ascending</option>
                </select>
            </div>
        </div>
    );
}

export default SortFilter;