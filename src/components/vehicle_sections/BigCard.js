import { Box, Card, Paper, Stack } from "@mui/material";
import React from "react";
import '../../styles/Vehicle.css';

const BigCard = ({ vehicle }) => {

    return (

        <div>

            <Card sx={{ padding: 0, margin: 4, borderRadius: 10, backgroundColor: "rgba(0, 0, 0, 0.02) "}}>

                <Stack display="flex" alignItems={{ xs: "center", sm: "center", md: "stretch" }} borderRadius={18} margin={0} padding={0} direction={{ xs: "column", sm: "column", md: "row" }}>


                    <Box width={{ xs: "100%", sm: "100%", md: "50%" }} margin={1} padding={2}>
                        <img
                            className="card__image"
                            src={vehicle.image}
                        />
                    </Box>


                    <Stack width={{ xs: "100%", sm: "100%", md: "50%" }}
                        margin={1}
                        padding={2}
                        justifyContent={{ md: "space-between" }}
                        direction={{ xs: "column", sm: "column", md: "row" }}>
                        <Stack display="flex" alignItems={{ xs: "center", sm: "center", md: "left" }} justifyContent="center">
                            <div className="card__date">{vehicle.injected.id} - {vehicle.attributes.vhcid}</div>
                            <span className="card__title">{vehicle.attributes.company}</span>
                            <div className="card__date">Make</div>
                            <span className="card__title">{vehicle.attributes.model}</span>
                            <div className="card__date">Model</div>
                            <span className="card__title">{vehicle.attributes.year}</span>
                            <div className="card__date">Year</div>
                        </Stack >

                        <Stack display="flex" alignItems={{ xs: "center", sm: "center", md: "end" }} justifyContent="center">
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
                            <Stack spacing={{ xs: 0, sm: 0, md: 1 }} display="flex" alignItems={{ xs: "center", sm: "center", md: "end" }} justifyContent="center" direction={{ xs: "column", sm: "column", md: "row" }}>
                                <Stack display="flex" alignItems="inherit" justifyContent="center">
                                    <span className="card__title2">{vehicle.attributes.doors}</span>
                                    <div className="card__date2">Doors</div>
                                </Stack>
                                <Stack display="flex" alignItems="inherit" justifyContent="center">
                                    <span className="card__title2">{vehicle.attributes.seats}</span>
                                    <div className="card__date2">Seats</div>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>


            </Card>
        </div>
    );
}

export default BigCard;