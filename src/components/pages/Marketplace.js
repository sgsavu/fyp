import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MiniCard from "../vehicle_sections/MiniCard";
import { filterByFilterObject, filterPriceRange, specialSort } from "../filters/filters";
import { listToNSublists } from "../utils/Other";
import Select from 'react-select'
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { default as Select2 } from "@mui/material/Select";

import { FormControl, Grid, IconButton, InputLabel, MenuItem, Tooltip, Typography } from '@mui/material';
import { fetchRate2, roundToNDigits, weiToMyCurrency } from "../utils/Exchange";
import { DeleteOutlined } from "@mui/icons-material";
import * as GameIcons from "react-icons/gi";
import * as MDIcons from "react-icons/md";
import * as FeatherIcons from "react-icons/fi";
import * as RiIcons from 'react-icons/ri';

export function getSaleVehicles(allVehicles) {
  let saleVehicles = {}

  for (const [tokenId, metadata] of Object.entries(allVehicles)) {
    if (metadata.injected.sale == true) {
      saleVehicles[tokenId] = metadata
    }
  }

  return saleVehicles
}


const Marketplace = () => {

  const data = useSelector((state) => state.data);
  const blockchain = useSelector((state) => state.blockchain);

  const [pageNr, setPageNr] = useState(0)
  const [pages, setPages] = useState([]);

  const [pool, setPool] = useState([])
  const [filterObject, setFilterObject] = useState([])

  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(10000)
  const [lowBound, setLowBound] = useState(0)
  const [highBound, setHighBound] = useState(10000)

  const [perPage, setPerPage] = useState(6);
  const [newSelect, setNewSelect] = useState(null)


  function newCopy(list) {
    return list.filter(() => true);
  }

  function getAttributesCollection(listOfVehicles) {
    var collection = {}
    for (var vehicle of listOfVehicles) {
      for (const [key, value] of Object.entries(vehicle.attributes)) {
        if (!collection.hasOwnProperty(key)) {
          collection[key] = []
        }
        if (!collection[key].includes(value)) {
          collection[key].push(value)
        }
      }
    }
    return collection
  }


  function assembleAllKeywords(allAttributes) {
    var temp = {}
    for (var key of Object.keys(allAttributes)) {
      for (var element of allAttributes[key]) {
        if (!temp.hasOwnProperty(key))
          temp[key] = []
        temp[key].push({ group: key, value: element, label: element, type: key })
      }
    }
    var temp3 = []
    for (var key of Object.keys(temp)) {
      var temp2 = {}
      temp2.label = key
      temp2.options = temp[key]
      temp3.push(temp2)
    }
    return temp3
  }



  function assemblePrice() {
    return [
      { group: "price", value: "ascending", label: "Ascending" },
      { group: "price", value: "descending", label: "Descending" }
    ]
  }

  function assembleShow() {
    return [
      { group: "show", value: "owner", label: "My Listings" },
      { group: "show", value: "topBidder", label: "My Bids" }
    ]
  }

  function assembleType() {
    return [
      { group: "type", value: "instant", label: "Instant" },
      { group: "type", value: "auction", label: "Auction" }
    ]
  }

  function assembleSearcher(allAttributes) {
    var newSelect = []
    if (blockchain.account) {
      newSelect.push({ label: "Show", options: assembleShow() })
    }
    newSelect.push({ label: "Type", options: assembleType() })
    newSelect.push({ label: "Price", options: assemblePrice() })
    newSelect = newSelect.concat(assembleAllKeywords(allAttributes))
    setNewSelect(newSelect)
  }

  async function createLowBoundary(vehicles) {
    var lowBoundary = 99999999999999999
    for (var vehicle of vehicles) {
      var parsedPrice = parseInt(vehicle.injected.price)
      if (parsedPrice < lowBoundary) {
        lowBoundary = parsedPrice
      }
    }
    var final = await weiToMyCurrency(lowBoundary) - 10
    final = final < 0 ? 0 : final
    setLowBound(roundToNDigits(2, final))
  }

  async function createHighBoundary(vehicles) {
    var highBoundary = 0
    for (var vehicle of vehicles) {
      var parsed = parseInt(vehicle.injected.price)
      if (parsed > highBoundary) {
        highBoundary = parsed
      }
    }
    var final = await weiToMyCurrency(highBoundary) + 10
    setHighBound(roundToNDigits(2, final))
  }



  useEffect(() => {
    var saleVehicles = getSaleVehicles(data.allVehicles)
    setPool(Object.values(saleVehicles))
    var allAttributes = getAttributesCollection(Object.values(saleVehicles))
    assembleSearcher(allAttributes)

  }, [data.allVehicles])


  useEffect(() => {

    var saleVehicles = getSaleVehicles(data.allVehicles)
    createLowBoundary(Object.values(saleVehicles))
    createHighBoundary(Object.values(saleVehicles))

  }, [data.displayCurrency, data.allVehicles])


  useEffect(() => {
    setPages(applyFilters(pool))
  }, [pool, filterObject, minPrice, maxPrice, perPage])



  function applyFilters(list) {
    setPageNr(0)
    var listOfVehicles = newCopy(list)
    listOfVehicles = specialSort(listOfVehicles)
    listOfVehicles = filterByFilterObject(filterObject, listOfVehicles, blockchain.account)
    listOfVehicles = filterPriceRange(listOfVehicles, minPrice, maxPrice)
    listOfVehicles = listToNSublists(listOfVehicles, perPage)
    return listOfVehicles
  }



  function loadFilterObject(list) {
    var mf = {}
    for (var object of list) {
      mf[object.group] = {}
      mf[object.group] = object.value
    }
    setFilterObject(mf)
  }

  const [value1, setValue1] = React.useState([lowBound, highBound]);
  const marks = [
    {
      value: lowBound,
      label: `${lowBound} ${data.displayCurrency}`,
    },
    {
      value: highBound,
      label: `${highBound} ${data.displayCurrency}`,
    },
  ];


  const handleChange2 = (event, newValue, activeThumb) => {
    var minDistance = highBound / 100

    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]]);
    } else {
      setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)]);
    }
  };

  const handleChange1 = (event, newValue) => {
    if (!Array.isArray(newValue)) {
      return;
    }
    setMinPrice(newValue[0])
    setMaxPrice(newValue[1])
  };



  function valueLabelFormat(value) {
    return `${value} ${data.displayCurrency}`;
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

  function onlyIfGroupNotSelected(selected) {
    if (filterObject.hasOwnProperty(selected.group))
      return true
    else
      return false
  }


  function handlePerPage(e) {
    setPerPage(e.target.value)
  }

  function tooltip() {
    return (
      <React.Fragment>
        <Typography color="inherit">The Market</Typography>
        <Stack display="flex" align-items="center" justify-content="center" flexDirection="column">
          <Box >
            <GameIcons.GiHomeGarage></GameIcons.GiHomeGarage> {"- Vehicle I have listed."}
          </Box>
          <Box>
            <MDIcons.MdPriceCheck></MDIcons.MdPriceCheck> {"- Vehicle for which I am top bidder."}
          </Box>
          <Box>
            <RiIcons.RiAuctionFill></RiIcons.RiAuctionFill> {"- Vehicle is listed as an auction."}
          </Box>
          <Box>
            {"Listings are instant by default. Only auctions have a designated icon."}
          </Box>
        </Stack>

      </React.Fragment>
    );
  }


  return (

    <Stack marginTop={2} display="flex" alignItems="center" justifyContent="center">



      <Box width={{xs: "80%",sm: "50%",md:"40%", lg: "30%"}}>
        <Select
          isOptionDisabled={onlyIfGroupNotSelected}
          formatGroupLabel={formatGroupLabel}
          placeholder="Search, select or sort..."
          onChange={loadFilterObject}
          isMulti={true}
          options={newSelect} />
      </Box>


      <Stack width={{xs: "75%",sm: "50%",md:"40%", lg: "30%"}} display="flex" align-items="center" justify-content="center" >
        <Slider
          min={lowBound}
          max={highBound}
          marks={marks}
          value={value1}
          step={highBound / 100}
          onChange={handleChange2}
          onChangeCommitted={handleChange1}
          valueLabelDisplay="auto"
          valueLabelFormat={valueLabelFormat}
        />
      </Stack>

      <Tooltip title={tooltip()}>
        <IconButton>
          <FeatherIcons.FiHelpCircle />
        </IconButton>
      </Tooltip>

      {pages.length != 0 ?
        <Grid container padding={5} spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 6, md: 12, xl: 18 }}>
          {pages[pageNr].map((vehicle, key) => {
            return (
              <Grid item xs={4} sm={6} md={6} xl={6} key={key}>
                <MiniCard key={key} vehicle={vehicle}></MiniCard>
              </Grid>
            );
          })}
        </Grid>
        :
        <Stack display="flex" align-items="center" justify-content="center">
          No vehicles available.
        </Stack>}


      <Stack display="flex" align-items="center" justify-content="center" flexDirection="column" >
        <Pagination page={pageNr + 1} onChange={(a, b) => { setPageNr(b - 1) }} showFirstButton showLastButton count={pages.length} />
      </Stack>

      <Stack>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 50 }}>
          <InputLabel>Per page</InputLabel>
          <Select2
            size="x"
            value={perPage}
            label="Per Page"
            onChange={handlePerPage}
          >
            <MenuItem value={6}>6</MenuItem>
            <MenuItem value={18}>18</MenuItem>
            <MenuItem value={60}>60</MenuItem>
          </Select2>
        </FormControl>
      </Stack>

    </Stack>
  );


}

export default Marketplace;