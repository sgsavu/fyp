import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from 'react-router-dom'

import { formUpdate, updateEntry, uploadImage } from "../../redux/minting/formActions";
import Dropzone from '../form/Dropzone';
import Form from "../form/Form";

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
        <div className='form-container'>
            <div className='form-content-left'>
                <Dropzone />
            </div>
            <div className='form-content-right'>
                <Form />
            </div>
        </div>
    );
}

export default Edit;