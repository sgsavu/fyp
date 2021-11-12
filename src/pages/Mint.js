import React, { useEffect} from 'react';
import '../styles/Form.css';
import '../styles/drop.css';
import FormFields from '../components/form/FormFields';
import ImageUpload from '../components/form/imageUpload';
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
            NFT_attributes = [...NFT_attributes, createAttribute(key, value)]
        }

        console.log(NFT_attributes)

        const NFT_name = elements.company + elements.vhcid;
        const NFT_description = "This token represents a real life vehicle.";

        createMetaDataAndMint(NFT_name, NFT_description, form.buffer, NFT_attributes);
    };

    const scramble = (string) => {

        //shuffle
        var x = string.split('').sort(function(){return 0.5-Math.random()}).join('');

        function substitute(str) { 
            var pos = Math.floor(Math.random()*str.length); 
            return str.substring(0, pos) + getRandomLetter() + str.substring(pos+1); 
        } 
        function getRandomLetter() { 
            var  letters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; 
            var pos = Math.floor(Math.random()*letters.length); 
            return letters.charAt(pos); 
        }

        for(var i = 0; i < randomIntFromInterval(1,10); i++) {
            x = string.split('').sort(function(){return 0.5-Math.random()}).join('');
            x = substitute(x)
        }

        return x
    }

    function randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
      }



    const createMetaDataAndMint = async (_name, _des, _imgBuffer, _attributes) => {

        try {
            const addedImage = await ipfsClient.add(_imgBuffer);

            const metaDataObj = {
                name: _name,
                description: _des,
                image: ipfsBaseUrl + addedImage.path,
                created: Date.now(),
                updated: Date.now(),
                attributes: _attributes,
                nonce1: scramble(blockchain.account),
                nonce2: randomIntFromInterval(1,1000000)
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
            startMintingProcess(form.fields)
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
