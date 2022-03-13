import React, { useEffect, useState, Component } from "react";
import { useSelector } from "react-redux";
import MiniCard from "../vehicle_sections/MiniCard";
import { filterByFilterObject, filterByInjectedValue, filterByPropertyExistence, filterByPropertyValue, filterPriceRange, sortBy, specialSort } from "../filters/filters";
import SearchFilter from "../filters/Search";
import { findKeyOfValueInObj, grabAllValuesFromObject, isValueInObject, listToNSublists } from "../utils/Other";
import '../../styles/Marketplace.css';
import Select from 'react-select'
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import * as MDIcons from "react-icons/md";

import { Accordion, AccordionDetails, AccordionSummary, Checkbox, FormControlLabel, Grid, Switch, Typography } from '@mui/material';


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
  const [filterByProperty, setFilterByProperty] = useState("default")


  const [proMode, setProMode] = useState(false)

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


  function assembleAllKeywords(allAttributes) {
    var temp = []
    for (var key of Object.keys(allAttributes)) {
      for (var element of allAttributes[key]) {
        temp.push({ group: "keywords", value: element, label: element, type: key })
      }
    }
    return temp
  }

  function assembleAllPriceSorts() {
    var temp = []
    var options = ["ascending", "descending"]
    for (var option of options) {
      temp.push({ group: "price", value: option, label: option.charAt(0).toUpperCase() + option.slice(1) })
    }
    return temp
  }


  function assembleSearcher(allAttributes) {
    var newSelect = []
    newSelect.push({ label: "Price", options: assembleAllPriceSorts() })
    newSelect.push({ label: "Keywords", options: assembleAllKeywords(allAttributes) })

    console.log("abuga", newSelect)
    setNewSelect(newSelect)
  }

  console.log("fasif", filterObject)
  useEffect(() => {
    if (vehicleList != undefined) {
      setPool(Object.values(vehicleList))
      setBackupPool(newCopy(Object.values(vehicleList)))

      var allAttributes = getAttributesCollection(Object.values(vehicleList))
      setAllAttributes(allAttributes)

      assembleSearcher(allAttributes)

      setAllValues(grabAllValuesFromObject(allAttributes))
    }
  }, [vehicleList, data.saleVehicles])



  function applyFilters(list) {

    var listOfVehicles = newCopy(list)
    if (proMode) {
      listOfVehicles = filterByPropertyValue(listOfVehicles, filterByProperty, true)
    }
    if (!proMode)
      listOfVehicles = specialSort(listOfVehicles)

    listOfVehicles = filterByFilterObject(filterObject, listOfVehicles)
    listOfVehicles = filterPriceRange(listOfVehicles, minPrice, maxPrice)
    listOfVehicles = listToNSublists(listOfVehicles, perPage)
    return listOfVehicles
  }

  useEffect(() => {
    setPages(applyFilters(pool))
  }, [pool, filterObject, minPrice, maxPrice, perPage, filterByProperty, proMode])


  function loadFilterObject(list) {

    var mf = {}
    for (var object of list) {
      mf[object.group] = {}
      if (object.group == "price")
        mf[object.group] = object.value
      else
        mf[object.group][object.type] = object.value
    }

    console.log('da filter object', mf)
    setFilterObject(mf)
  }


  function togglePageType() {
    if (pageType == "instant")
      setPageType("auctions")
    else if (pageType == "auctions")
      setPageType("instant")

    setFilterByProperty("default")
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


  console.log(newSelect)


  function toggleProMode() {
    setFilterByProperty("default")
    setProMode(!proMode)
  }


  const formatGroupLabel = data => (
    <Stack justifyContent="space-between" display="flex" flexDirection="row"  >
      <Box>
        {data.label}
      </Box>
      <Box>
        ({data.options.length})
      </Box>
    </Stack>

  );


  return (

    <div className="market-main">



      <div className="cardwrapper2">
        <div className="phone3" onClick={togglePageType}>
          <div className={pageType == "auctions" ? "toggle-right" : "toggle-left"}></div>
          <div className="options">
            <p className={pageType == "auctions" ? "optionOff" : "optionOn"}>Instant</p>
            <p className={pageType == "auctions" ? "optionOn" : "optionOff"}>Auctions</p>
          </div>
        </div>
      </div>






      <Box sx={{ width: 400 }}>
        <Select isOptionDisabled={(e) => {
          if (e.group == "price" && filterObject.hasOwnProperty("price"))
            return true
          else
            return false
        }} formatGroupLabel={formatGroupLabel} placeholder="Search, select or sort..." onChange={loadFilterObject} isMulti={true} options={newSelect} />
      </Box>


      <div >
        {proMode ? <div>
          <label>Show:</label>
          <select onChange={(e) => setFilterByProperty(e.target.value)}>
            <option value="default">
              Default
            </option>
            {pageType == "auctions" ? <option value="bid">
              My Bids
            </option> : null}
            <option value="mine">
              My Listings
            </option>
          </select>
        </div> : null}

     
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



      <FormControlLabel
        control={
          <Switch checked={proMode} onChange={toggleProMode} color="warning" />
        }
        label="Pro Mode"
      />



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



      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {pages.length != 0 ? pages[pageNr].map((vehicle, key) => {
          return (
            <Grid item xs={2} sm={4} md={4} key={key}>
              <MiniCard key={key} vehicle={vehicle}></MiniCard>
            </Grid>
          );
        }) : <p className="center">No vehicles available.</p>}
      </Grid>


      <div className="center">
        <Pagination showFirstButton showLastButton count={pages.length} />
      </div>



    </div>
  );


}

export default Marketplace;