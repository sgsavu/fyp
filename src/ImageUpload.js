import React from 'react';
import './styles/Form.css';
import './styles/drop.css';
import { useDispatch, useSelector } from "react-redux";
import { uploadImage } from "./redux/minting/formActions";
import validateInfo from './validate';
import { useDropzone } from "react-dropzone"

const ImageUpload = () => {

    const dispatch = useDispatch();
    const form = useSelector((state) => state.form);

    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({

        multiple: false,
        accept: "image/*",
        onDrop: (acceptedFiles) => {
            const reader = new FileReader();
            reader.readAsDataURL(acceptedFiles[0]);
            reader.onload = () => {
                dispatch(uploadImage(URL.createObjectURL(acceptedFiles[0]),Buffer(reader.result.split(",")[1], "base64")))
            };
           
            /*
            const i = new Image()
            const w = preview
            i.src = preview
    
            console.log(i.width)
            console.log(i.height)
            */
        },
    })

    return (
        <div>
            <p>Vehicle Image</p>
            <div {...getRootProps()} className={isDragActive ? "dropzone-active" : "dropzone"}>
                <input {...getInputProps()} />
                <img src={form.preview} className="form-img" />
                <p>Drag & drop <br></br> OR <br></br>Click to upload an image</p>
            </div>
        </div>
    );
};

export default ImageUpload;
