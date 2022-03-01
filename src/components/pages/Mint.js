import React, { useEffect } from 'react';
import '../../styles/Form.css';
import '../../styles/drop.css';
import FormFields from '../minting_form/FormFields';
import ImageUpload from '../minting_form/imageUpload';
import { useDispatch, useSelector } from "react-redux";
import { create } from "ipfs-http-client";
import { finishSubmit, errorSubmit } from '../../redux/minting/formActions';
import {  callChainFunction } from '../utils/BlockchainGateway'
import { scramble, randomIntFromInterval } from '../utils/CryptographyUtils'
import { alerts } from '../../redux/app/appActions';
import { getUserAccount } from '../../redux/reduxUtils';

const Mint = () => {

    const dispatch = useDispatch();
    const form = useSelector((state) => state.form);
    const ipfsBaseUrl = "https://ipfs.infura.io/ipfs/";
    const ipfsClient = create("https://ipfs.infura.io:5001/api/v0");




    
    const createMetaDataAndMint = async () => {

        try {
            const addedImage = await ipfsClient.add(form.buffer);
            const metaDataObj = {
                image: ipfsBaseUrl + addedImage.path,
                created: Date.now(),
                updated: Date.now(),
                attributes: form.fields,
                nonce1: scramble(await getUserAccount()),
                nonce2: randomIntFromInterval(1, 1000000)
            };

            console.log(metaDataObj)

            const addedMetaData = await ipfsClient.add(JSON.stringify(metaDataObj));
            console.log(ipfsBaseUrl + addedMetaData.path);
            dispatch(callChainFunction("createVehicle",[ipfsBaseUrl + addedMetaData.path]))
            dispatch(alerts({ alert: "other", message: "Transaction sent for processing."}))
            dispatch(finishSubmit());

        } catch (err) {
            console.log(err);
            dispatch(errorSubmit())
        };
    };

    useEffect(() => {
        if (form.submitting === true) {
            createMetaDataAndMint()
        }
    }, [form.submitting]);

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
