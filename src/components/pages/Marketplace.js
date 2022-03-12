import React, { useEffect, useState, Component } from "react";
import { useSelector } from "react-redux";
import VehicleCard from "../vehicle_sections/MiniCard";
import { filterByFilterObject, filterByInjectedValue, filterByPropertyExistence, filterPriceRange, sortBy } from "../filters/filters";
import SearchFilter from "../filters/Search";
import { findKeyOfValueInObj, grabAllValuesFromObject, isValueInObject, listToNSublists } from "../utils/Other";
import '../../styles/Marketplace.css';
import Select from 'react-select'
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, ToggleButton, ToggleButtonGroup } from '@mui/material';


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

  const [minPrice, setMinPrice] = useState(1)
  const [maxPrice, setMaxPrice] = useState(10000)
  const [perPage, setPerPage] = useState(10);
  const [sortType, setSortType] = useState("ascending")
  const [filterByProperty, setFilterByProperty] = useState("id")




  const [newSelect, setNewSelect] = useState(null)


  function newCopy(list) {
    const copy = list.filter(() => true);
    return copy
  }

  const options = [
    { value: 'chocolate', label: 'Chocolate', type: "boss" },
    { value: 'strawberry', label: 'Strawberry', type: "boss2" },
    { value: 'vanilla', label: 'Vanilla', type: "boss3" }
  ]


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


  function createNewObj(allAttributes) {

    var boss = []
    for (var key of Object.keys(allAttributes)) {
      for (var element of allAttributes[key]) {
        boss.push({ value: element, label: element, type: key })
      }
    }
    return boss
  }



  useEffect(() => {
    if (vehicleList != undefined) {
      setPool(Object.values(vehicleList))
      setBackupPool(newCopy(Object.values(vehicleList)))

      var allAttributes = getAttributesCollection(Object.values(vehicleList))
      setAllAttributes(allAttributes)
      setNewSelect(createNewObj(allAttributes))
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
    for (var object of list) {
      mf[object.type] = object.value
    }
    setFilterObject(mf)
  }


  function togglePageType() {
    if (pageType == "instant")
      setPageType("auctions")
    else if (pageType == "auctions")
      setPageType("instant")
  }



  function valuetext(value) {
    return `${value}`;
  }

  const [value1, setValue1] = React.useState([0, 10000]);

  var minDistance = 1000

  const handleChange1 = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]]);
      setMinPrice(Math.min(newValue[0], value1[1] - minDistance))
    } else {
      setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)]);
      setMaxPrice(Math.max(newValue[1], value1[0] + minDistance))
    }
  };

  const marks = [
    {
      value: 0,
      label: '0',
    },

    {
      value: 10000,
      label: '10000',
    },
  ];

  const [alignment, setAlignment] = React.useState('web');

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };


  return (

    <div className="market-main">




      <div className="cardwrapper2">
        <div className="phone3"  onClick={() => { togglePageType() }}>
            <div className={pageType == "auctions" ? "toggle-right" : "toggle-left"}></div>
            <div className="options">
              <p className={pageType == "auctions" ? "optionOff" : "optionOn"}>Instant</p>
              <p className={pageType == "auctions" ? "optionOn" : "optionOff"}>Auctions</p>
            </div>
        </div>
      </div>






      <Box sx={{ width: 400 }}>
        <Select placeholder="Search, select or filter..." onChange={loadFilterObject} isMulti={true} options={newSelect} />
      </Box>



      <div >
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




      <Stack width="50%" display="flex" align-items="center" justify-content="center" backgroud-color="black" >
        <Slider
          min={0}
          max={10000}

          marks={marks}
          value={value1}
          step={1000}
          onChange={handleChange1}
          valueLabelDisplay="auto"
        />
      </Stack>





      <div className="cards">
        {pages.length != 0 ? pages[pageNr].map((vehicle, key) => {
          return (
            <VehicleCard key={key} vehicle={vehicle}></VehicleCard>
          );
        }) : <p className="center">No vehicles available.</p>}
      </div>


      <div className="center">
        <Pagination showFirstButton showLastButton count={pages.length} />
      </div>



    </div>
  );


}

export default Marketplace;