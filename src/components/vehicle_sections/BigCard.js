import { Box, Card, Stack } from "@mui/material";
import React from "react";
import '../../styles/Vehicle.css';

const BigCard = ({ vehicle }) => {

    return (
        <div>
            <Card sx={{ padding: 0, margin: 4, borderRadius: 10, backgroundColor: "rgba(0, 0, 0, 0.02) "}}>
                <Stack display="flex" alignItems={{ xs: "center", sm: "center", md: "stretch" }} borderRadius={18} margin={0} padding={0} direction={{ xs: "column", sm: "column", md: "row" }}>
                    <Box width={{ xs: "100%", sm: "100%", md: "50%" }} margin={1} padding={2}>
                        <img
                            style={{
                                objectFit: "cover",
                                width: "100%",
                                height: "100%",
                                borderRadius: "30px",
                            }}
                            src={vehicle.image}
                        />
                    </Box>

                    <Stack width={{ xs: "100%", sm: "100%", md: "50%" }}
                        margin={1}
                        padding={2}
                        justifyContent={{ md: "space-between" }}
                        direction={{ xs: "column", sm: "column", md: "row" }}>
                        <Stack display="flex" alignItems={{ xs: "center", sm: "center", md: "left" }} justifyContent="center">
                            <div className="vehicle-text-attribute">{vehicle.injected.id} - {vehicle.attributes.vhcid}</div>
                            <span className="vehicle-text-value">{vehicle.attributes.company}</span>
                            <div className="vehicle-text-attribute">Make</div>
                            <span className="vehicle-text-value">{vehicle.attributes.model}</span>
                            <div className="vehicle-text-attribute">Model</div>
                            <span className="vehicle-text-value">{vehicle.attributes.year}</span>
                            <div className="vehicle-text-attribute">Year</div>
                        </Stack >

                        <Stack display="flex" alignItems={{ xs: "center", sm: "center", md: "end" }} justifyContent="center">
                            <span className="vehicle-text-value-secondary">{vehicle.attributes.color}</span>
                            <div className="vehicle-text-attribute-secondary">Color</div>
                            <span className="vehicle-text-value-secondary">{vehicle.attributes.body}</span>
                            <div className="vehicle-text-attribute-secondary">Body</div>
                            <span className="vehicle-text-value-secondary">{vehicle.attributes.transmission}</span>
                            <div className="vehicle-text-attribute-secondary">Transmission</div>
                            <span className="vehicle-text-value-secondary">{vehicle.attributes.fuel}</span>
                            <div className="vehicle-text-attribute-secondary">Fuel</div>
                            <span className="vehicle-text-value-secondary">{vehicle.attributes.engine}</span>
                            <div className="vehicle-text-attribute-secondary">Engine</div>
                            <span className="vehicle-text-value-secondary">{vehicle.attributes.driver_side}</span>
                            <div className="vehicle-text-attribute-secondary">Driver Side</div>
                            <Stack spacing={{ xs: 0, sm: 0, md: 1 }} display="flex" alignItems={{ xs: "center", sm: "center", md: "end" }} justifyContent="center" direction={{ xs: "column", sm: "column", md: "row" }}>
                                <Stack display="flex" alignItems="inherit" justifyContent="center">
                                    <span className="vehicle-text-value-secondary">{vehicle.attributes.doors}</span>
                                    <div className="vehicle-text-attribute-secondary">Doors</div>
                                </Stack>
                                <Stack display="flex" alignItems="inherit" justifyContent="center">
                                    <span className="vehicle-text-value-secondary">{vehicle.attributes.seats}</span>
                                    <div className="vehicle-text-attribute-secondary">Seats</div>
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