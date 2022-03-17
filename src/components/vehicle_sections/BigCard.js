import { Box, Divider, Paper, Stack } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import '../../styles/Vehicle.css';

const BigCard = ({ vehicle }) => {

    return (

        <div>

            <div>

                <Stack borderRadius={18} margin={3} padding={3} direction={{ xs: "column", sm: "column", md: "row" }}>


                    <Box  width={{ xs: "100%", sm: "100%", md: "50%" }} margin={2} padding={2}>
                        <img 
                        className="card__image"
                            src={vehicle.image}
                        />
                    </Box>


                    <Stack width={{ xs: "100%", sm: "100%", md: "50%" }} margin={2} padding={2} justifyContent={{ md: "space-between" }} direction={{ xs: "column", sm: "column", md: "row" }}>
                        <Stack display="flex" alignItems="left" justifyContent="center">
                            <div className="card__date">{vehicle.attributes.vhcid}</div>
                            <span className="card__title">{vehicle.attributes.company}</span>
                            <div className="card__date">Make</div>
                            <span className="card__title">{vehicle.attributes.model}</span>
                            <div className="card__date">Model</div>
                            <span className="card__title">{vehicle.attributes.year}</span>
                            <div className="card__date">Year</div>
                        </Stack >
                        
                        <Stack display="flex" alignItems="end" justifyContent="center">
                            <span className="card__title2">{vehicle.attributes.color}</span>
                            <div className="card__date2">Color</div>
                            <span className="card__title2">{vehicle.attributes.body}</span>
                            <div className="card__date2">Body</div>
                            <span className="card__title2">{vehicle.attributes.transmission}</span>
                            <div className="card__date2">Transmission</div>
                            <span className="card__title2">{vehicle.attributes.fuel}</span>
                            <div className="card__date2">Fuel</div>
                            <span className="card__title2">{vehicle.attributes.engine}</span>
                            <div className="card__date2">Engine</div>
                            <span className="card__title2">{vehicle.attributes.driver_side}</span>
                            <div className="card__date2">Driver Side</div>
                            <Stack spacing={{xs:0,sm:0,md:1}} display="flex" alignItems="end" justifyContent="center" direction={{ xs: "column", sm: "column", md: "row" }}>
                                <Stack display="flex" alignItems="end" justifyContent="center">
                                    <span className="card__title2">{vehicle.attributes.doors}</span>
                                    <div className="card__date2">Doors</div>
                                </Stack>
                                <Stack display="flex" alignItems="end" justifyContent="center">
                                    <span className="card__title2">{vehicle.attributes.seats}</span>
                                    <div className="card__date2">Seats</div>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>


            </div>
        </div>
    );
}

export default BigCard;