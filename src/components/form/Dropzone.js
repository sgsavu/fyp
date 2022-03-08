import React, { useEffect } from 'react';
import '../../styles/Form.css';
import '../../styles/drop.css';
import { useDispatch, useSelector } from "react-redux";
import { uploadImage } from "../../redux/minting/formActions";
import { useDropzone } from "react-dropzone"

const Dropzone = () => {


    const dispatch = useDispatch();
    const form = useSelector((state) => state.form);
    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
        multiple: false,
        accept: "image/*",
        onDrop: (acceptedFiles) => {
            const reader = new FileReader();
            reader.readAsDataURL(acceptedFiles[0]);
            console.log(acceptedFiles[0])
            reader.onload = () => {
                dispatch(uploadImage({ preview: URL.createObjectURL(acceptedFiles[0]), buffer: Buffer(reader.result.split(",")[1], "base64") }))
            };


            const img = new Image();
            img.onload = function () {
                alert(this.width + 'x' + this.height);
            }
            img.src = URL.createObjectURL(acceptedFiles[0]);

          

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

export default Dropzone;
