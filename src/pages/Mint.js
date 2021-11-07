import React, { useEffect, useState } from 'react';
import '../styles/Form.css';
import '../styles/drop.css';
import FormFields from '../FormFields';
import ImageUpload from '../ImageUpload';
import { useDispatch, useSelector } from "react-redux";
import { create } from "ipfs-http-client";
import { fetchData } from "../redux/data/dataActions";
import { finishSubmit } from '../redux/minting/formActions';


const ipfsClient = create("https://ipfs.infura.io:5001/api/v0");

const Mint = () => {


    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);
    const form = useSelector((state) => state.form);
    const ipfsBaseUrl = "https://ipfs.infura.io/ipfs/";



    const mint = (_uri) => {
        blockchain.smartContract.methods
            .mint(_uri)
            .send({ from: blockchain.account })
            .once("error", (err) => {
                console.log(err);
            })
            .then((receipt) => {
                console.log(receipt);
                dispatch(fetchData(blockchain.account));
                dispatch(finishSubmit());
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
            if (key !== "step" && key != "preview" && key != "buffer" && key != "submitting")
                NFT_attributes = [...NFT_attributes, createAttribute(key, value)]
        }

        console.log(NFT_attributes)

        const NFT_name = elements.company + elements.vhcid;
        const NFT_description = "This token represents a real life vehicle.";

        createMetaDataAndMint(NFT_name, NFT_description, form.buffer, NFT_attributes);
    };

    const createMetaDataAndMint = async (_name, _des, _imgBuffer, _attributes) => {

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
        };
    };





    useEffect(() => {
        if (form.submitting === true) {
            startMintingProcess(form)
        }
    }, [form.submitting, dispatch]);


    return (

        <div className='form-container'>
            <div className='form-content-left'>
                <ImageUpload />
            </div>
            <div className='form-content-right'>
                <FormFields />
            </div>
        </div>
        
    );
};

export default Mint;
