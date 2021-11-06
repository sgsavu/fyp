import React, { useState } from 'react';
import './Form.css';
import './drop.css';
import FormFields from './FormFields';
import { useDispatch, useSelector } from "react-redux";
import { create } from "ipfs-http-client";
import { fetchData } from "./redux/data/dataActions";
import { useDropzone } from "react-dropzone"


const ipfsClient = create("https://ipfs.infura.io:5001/api/v0");

const Form = () => {

    const [isSubmitted, setIsSubmitted] = useState(false);
    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);
    let [buffer, setBuffer] = useState([]);
    const ipfsBaseUrl = "https://ipfs.infura.io/ipfs/";
    const [files, setFiles] = useState([])


    const { getRootProps, getInputProps, isDragAccept, isDragReject, } = useDropzone({
        isDragActive: () => {

        },
        multiple: false,
        accept: "image/*",
        onDrop: (acceptedFiles) => {


            const reader = new FileReader();
            reader.onload = (event) => {
                console.log(reader.result)
                setBuffer(Buffer(reader.result.split(",")[1], "base64"))
                console.log('buffer', buffer)
            };

            reader.readAsDataURL(acceptedFiles[0]);

            setFiles(
                URL.createObjectURL(acceptedFiles[0])
            )


        },
    })





    const mint = (_uri) => {
        blockchain.smartContract.methods
            .mint(_uri)
            .send({ from: blockchain.account })
            .once("error", (err) => {
                console.log(err);
                //setLoading(false);
                //setStatus("Error");
            })
            .then((receipt) => {
                console.log(receipt);
                //setLoading(false);
                dispatch(fetchData(blockchain.account));
                //setStatus("Successfully minting your NFT");
            });
    };

    const createAttribute = (type, value) => {
        return {
            trait_type: type,
            value: value
        }
    }

    const startMintingProcess = (elements) => {

        let NFT_attributes = []

        for (const [key, value] of Object.entries(elements)) {
            NFT_attributes = [...NFT_attributes, createAttribute(key, value)]
        }

        console.log(NFT_attributes)

        const NFT_name = elements.company + elements.vhcid;
        const NFT_description = "This token represents a real life vehicle.";

        createMetaDataAndMint(NFT_name, NFT_description, buffer, NFT_attributes);
    };

    const createMetaDataAndMint = async (_name, _des, _imgBuffer, _attributes) => {
        // setLoading(true);
        //setStatus("Uploading to IPFS");
        try {
            const addedImage = await ipfsClient.add(_imgBuffer);

            const metaDataObj = {
                name: _name,
                description: _des,
                image: ipfsBaseUrl + addedImage.path,
                attributes: _attributes
            };
            const addedMetaData = await ipfsClient.add(JSON.stringify(metaDataObj));
            console.log(ipfsBaseUrl + addedMetaData.path);
            mint(ipfsBaseUrl + addedMetaData.path);
        } catch (err) {
            console.log(err);
            //setLoading(false);
            //("Error");

        };
    };



    function submitForm() {
        setIsSubmitted(true);
    }



    return (

        <div className='form-container'>
            <div className='form-content-left'>
                <div {...getRootProps()} className="dropzone">
                    <input {...getInputProps()} />
                    {isDragAccept ? <p>Drop files here</p> : <p>Don't drop files here</p>}
                    <img src={files} className=".form-img"/>
                </div>
            </div>

            {!isSubmitted ? (
                <FormFields submitForm={startMintingProcess} />
            ) : (
                null
            )}
        </div>
    );
};

export default Form;
