import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../redux/blockchain/blockchainActions";
import { fetchData } from "../redux/data/dataActions";
import * as s from "../styles/globalStyles";
import styled from "styled-components";
import { create } from "ipfs-http-client";
import Dropzone from 'react-dropzone';

const ipfsClient = create("https://ipfs.infura.io:5001/api/v0");


function Mint() {

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [NFTS, setNFTS] = useState([]);
  const ipfsBaseUrl = "https://ipfs.infura.io/ipfs/";
  const name = "NFT name";
  const description = "IPFS minted nft woooooo.";


  let buffer = [];


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

  const startMintingProcess = () => {
    const color = createAttribute("Color", "Black")
    const body = createAttribute("Body", "Hatchback")
    const transmission = createAttribute("Transmission", "Manual")
    const mileage = createAttribute("Mileage", "28481")
    const fuel = createAttribute("Fuel", "Diesel")
    const engine = createAttribute("Engine", "1.5V")
    const doors = createAttribute("Doors", "5")
    const seats = createAttribute("Seats", "5")
    const attributes = [color, body, transmission, mileage, fuel, engine, doors, seats]
    createMetaDataAndMint(name, description, buffer, attributes);
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


  const onDrop = (file) => {
    
      const reader = new FileReader();
      reader.onload = (event) => {
        
        console.log(reader.result)
        buffer = Buffer(reader.result.split(",")[1],"base64") 
        console.log('buffer', buffer)
      };
      reader.readAsDataURL(file[0]);
  
    }


    return (
        <s.Screen>
          
            <s.Container flex={1} ai={"center"} style={{ padding: 24 }}>
              <s.TextTitle style={{ textAlign: "center" }}>
                Welcome mint your signature
              </s.TextTitle>
              {loading ? (
                <>
                  <s.SpacerSmall />
                  <s.TextDescription style={{ textAlign: "center" }}>
                    loading...
                  </s.TextDescription>
                </>
              ) : null}
              {status !== "" ? (
                <>
                  <s.SpacerSmall />
                  <s.TextDescription style={{ textAlign: "center" }}>
                    {status}
                  </s.TextDescription>
                </>
              ) : null}
              <s.SpacerLarge />
              <Dropzone onDrop={onDrop}>
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive ? "Drop it like it's hot!" : 'Click me or drag a file to upload!'}
            </div>
          )}
        </Dropzone>
              <s.Container fd={"row"} jc={"center"}>
                  
                <s.StyledButton
                  onClick={(e) => {
                    e.preventDefault();
                    startMintingProcess();
                  }}
                >
                  MINT
                </s.StyledButton>
                
              </s.Container>
              <s.SpacerLarge />
              
             
              
            </s.Container>
          
        </s.Screen>
      );
}

export default Mint;