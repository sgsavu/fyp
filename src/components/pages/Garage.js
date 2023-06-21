import { Grid } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { roles } from '../utils/Roles';
import MiniCard from '../vehicle_sections/MiniCard';

const Garage = () => {
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);

    return (
        <div>
            {data.myRole === roles.GARAGE_ROLE ?
                <Grid container padding={5} spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {Object.values(data.allVehicles).map((vehicle, index) => {
                        if (vehicle.injected.garage !== blockchain.account) {
                            return null
                        }

                        return (
                            <Grid item xs={2} sm={4} md={4} key={index}>
                                <MiniCard key={index} vehicle={vehicle}></MiniCard>
                            </Grid>
                        );
                    })}
                </Grid>
                : null}
        </div>
    );
}

export default Garage;