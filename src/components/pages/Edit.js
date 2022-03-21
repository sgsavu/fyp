import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from 'react-router-dom'

import { formUpdate, updateEntry, uploadImage } from "../../redux/minting/formActions";
import Dropzone from '../form/Dropzone';
import Form from "../form/Form";
import Mint from "./Mint";

/**
  * Edit page for the Garage class to use to modify tokenURIS for approved
  * vehicles.
  */
const Edit = () => {

    const location = useLocation()
    let vehicle = location.state?.metadata
    const dispatch = useDispatch();

    useEffect(async () => {

        Object.keys(vehicle.attributes).forEach((element) => {
            dispatch(
                formUpdate({ name: element, value: vehicle.attributes[element] })
            );
        })

        dispatch(uploadImage({ preview: new URL(vehicle.image), buffer: [] }))

        dispatch(
            updateEntry({ name: "edit", value: vehicle })
        );

    }, [])

    return (
        <Mint/>
    );
}

export default Edit;