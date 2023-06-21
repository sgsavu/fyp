import React from 'react';
import Form from '../form/Form';
import Dropzone from '../form/Dropzone';
import { Stack } from '@mui/material';

const Mint = () => {
    return (
        <Stack
            mt={5}
            display="flex"
            direction={{ xs: "column", sm: "column", md: "column", lg: "row" }}
            justifyContent="center"
            alignItems="center"
        >
            <Stack
                borderRadius="10px"
                width={{ lg: "80%", xl: "60%" }}
                sx={{
                    background: "linear-gradient(90deg,rgb(39, 176, 255) 0%,rgb(0, 232, 236) 50%)"

                }}
                display="flex"
                direction={{ xs: "column", sm: "column", md: "column", lg: "row" }}
                justifyContent="center"
                alignItems="center"
            >
                <Dropzone></Dropzone>
                <Form></Form>
            </Stack>
        </Stack>
    );
};

export default Mint;
