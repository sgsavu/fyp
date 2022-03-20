import { create } from "ipfs-http-client";
import { callChainFunction } from "../../components/utils/GatewayParser";
import { randomIntFromInterval, scramble } from "../../components/utils/Cryptography";
import { alerts } from "../app/appActions";
import { getUserAccount } from "../reduxUtils";
import store from "../store";

export const nextStep = () => {
  return {
    type: "NEXT_STEP",
  };
};

export const prevStep = () => {
  return {
    type: "PREV_STEP",
  };
};

export const formUpdate = (payload) => {
  return {
    type: "UPDATE",
    payload: payload,
  };
};

export const updateEntry = (payload) => {
  return {
    type: "UPDATE_ENTRY",
    payload: payload,
  };
};

export const uploadImage = (payload) => {
  return {
    type: "UPLOAD_IMAGE",
    payload: payload,
  };
};

export const resetForm = () => {
  return {
    type: "RESET",
  };
};

export const createMetaDataAndMint = () => {
  return async (dispatch) => {
    try {
      const form = await store.getState().form
      const ipfsClient = create("https://ipfs.infura.io:5001/api/v0");
      const image = (await ipfsClient.add(form.buffer)).path;
      const metaDataObj = {
        image: image,
        created: Date.now(),
        updated: Date.now(),
        attributes: form.fields,
        nonce1: scramble(await getUserAccount()),
        nonce2: randomIntFromInterval(1, 1000000)
      };
      const vehicleHash = (await ipfsClient.add(JSON.stringify(metaDataObj))).path;
      dispatch(
        updateEntry({ name: "loading", value: true })
      );
      await dispatch(callChainFunction("mint", [vehicleHash]))
      dispatch(
        updateEntry({ name: "loading", value: false })
      );
      dispatch(resetForm())

    } catch (err) {
      dispatch(
        updateEntry({ name: "loading", value: false })
      );
      dispatch(alerts({ alert: "error", message: err.message }))
    };
  };
};

export const updateMetadata = () => {
  return async (dispatch) => {
    try {

      const form = await store.getState().form
      const ipfsClient = create("https://ipfs.infura.io:5001/api/v0");

      let vehicle = form.edit

      vehicle.attributes = form.fields

      var vehicleId = vehicle.injected.id
      
      vehicle.updated = Date.now()


      if (form.buffer.length != 0) {
        const image =  (await ipfsClient.add(form.buffer)).path;
        vehicle.image = image
      } else {
        var removeLinkFrame = vehicle.image.indexOf("/ipfs/")
        if(removeLinkFrame!=-1){
          vehicle.image = vehicle.image.slice(removeLinkFrame + 6, vehicle.image.length)
        }
      }

      const newVehicle = Object.assign({}, vehicle);
    
      delete newVehicle.injected

      const vehicleHash =  (await ipfsClient.add(JSON.stringify(newVehicle))).path;
      dispatch(
        updateEntry({ name: "loading", value: true })
      );
        

      await dispatch(await callChainFunction("setTokenURI", [vehicleId, vehicleHash]))
      dispatch(
        updateEntry({ name: "loading", value: false })
      );
      dispatch(resetForm())

    } catch (err) {
      dispatch(
        updateEntry({ name: "loading", value: false })
      );
      dispatch(alerts({ alert: "error", message: err.message }))
    };
  };
};




