import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAccount } from '../../redux/reduxUtils';
import { callChainFunction, callViewChainFunction } from '../utils/BlockchainGateway';
import { roles } from '../utils/PermissionsAndRoles';
import VehicleCard from '../vehicle_sections/VehicleCard';

const Garage = () => {

    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);
    const [myVehicles, setMyVehicles] = useState([])
    const [address,setAddress] = useState("")
    const [vehicle,setVehicle] = useState("")

    useEffect(async () => {
        let temp = []
        for (var i = 0; i < Object.keys(data.allVehicles).length; i++) {
            if (await getUserAccount() == await callViewChainFunction("getApprovedGarage", [i]))
                temp.push(data.allVehicles[i])
        }
        setMyVehicles(temp)

    }, [data.allVehicles])


    async function approve () {
        dispatch(await callChainFunction("setApprovedGarage", [vehicle,address]))
    }

    return (
        <div>
            {data.myRole == roles.GARAGE_ROLE ? myVehicles.map((vehicle, index) => {
                return (
                    <VehicleCard key={index} vehicle={vehicle}></VehicleCard>
                );
            }) : <div>

            <label>Approve garage: </label>
            <input onChange={(e) => {setVehicle(e.target.value)}} placeholder='VehicleId' value={vehicle}></input>
            <input onChange={(e) => {setAddress(e.target.value)}} placeholder='Address' value={address}></input>
            <button onClick={approve}>Approve</button>
            </div>}
        </div>
    );
}

export default Garage;