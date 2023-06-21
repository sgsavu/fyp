import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { uploadImage } from "../../redux/minting/formActions";
import { useDropzone } from "react-dropzone"
import { Stack } from '@mui/material';
import { alerts } from '../../redux/app/appActions';
import { gcd } from '../utils/Other';
/**
  * Dropzone component which allows for users to upload images
  * This is regulated and restricted on uploading certain dimensions for
  * images. 
  * The user can either drag and drop or click to upload.
  */
const Dropzone = () => {
    const dispatch = useDispatch();
    const form = useSelector((state) => state.form);

    const [goodToGo, setGoodToGo] = useState(false)
    const [buffer, setBuffer] = useState(null)
    const [preview, setPreview] = useState(null)

    function checkDimensions() {
        try {
            var gcxd = gcd(this.width, this.height)
            if (this.width / gcxd - this.height / gcxd < 0)
                throw Error("Image must not have a portrait aspect ratio.")
            setGoodToGo(true)
        }
        catch (err) {
            dispatch(alerts({ alert: "error", message: err.message }))
        }
    }

    const { getRootProps, getInputProps } = useDropzone({
        multiple: false,
        accept: "image/*",
        onDrop: (acceptedFiles) => {
            try {
                const reader = new FileReader();
                reader.onload = (boss) => {
                    setPreview(URL.createObjectURL(acceptedFiles[0]))
                    setBuffer(Buffer(reader.result.split(",")[1], "base64"))
                };
                reader.readAsDataURL(acceptedFiles[0]);

                const img = new Image();
                img.onload = checkDimensions
                img.src = URL.createObjectURL(acceptedFiles[0]);
            }
            catch (err) {
                dispatch(alerts({ alert: "error", message: err.message }))
            }
        },
    })

    useEffect(() => {
        if (goodToGo) {
            dispatch(uploadImage({ preview: preview, buffer: buffer }))
            setGoodToGo(false)
        }
    }, [goodToGo])

    return (
        <Stack
            sx={{
                background: "linear-gradient(90deg,rgb(39, 176, 255) 0%,rgb(0, 232, 236) 100%)"
            }}
            borderRadius="10px"
            bgcolor="red"
            display="flex"
            alignItems="center"
            justifyContent="center"
            padding={4}
            spacing={2}
            width={{ xs: "100%", sm: "100%", md: "100%", lg: "50%" }}
        >
            <p>Vehicle Image</p>
            <div {...getRootProps()} >
                <input {...getInputProps()} />
                <img
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                    }}
                    className='form-img' src={form.preview} />
            </div>
            <p>Drag & drop or click to upload an image</p>
        </Stack>
    );
};

export default Dropzone;
