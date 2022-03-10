import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAccount } from '../../redux/reduxUtils';
import { callChainFunction, callViewChainFunction } from '../utils/GatewayParser';
import { roles } from '../utils/Roles';
import VehicleCard from '../vehicle_sections/MiniCard';

const Garage = () => {

    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);
    const [myVehicles, setMyVehicles] = useState([])
    const [address,setAddress] = useState("")
    const [vehicle,setVehicle] = useState("")

    useEffect(() => {
    

    }, [data.allVehicles])
    

    async function approve () {
        dispatch(await callChainFunction("setApprovedGarage", [vehicle,address]))
    }

    return (
        <div>
            {data.myRole == roles.GARAGE_ROLE ? Object.values(data.allVehicles).map((vehicle, index) => {
                if (vehicle.injected.garage)
                return (
                    <VehicleCard key={index} vehicle={vehicle}></VehicleCard>
                );
            }) : <div>
            <label>Approve garage: </label>
            <select onChange={(e) => setVehicle(e.target.value)}>
                {Object.keys(data.myVehicles).map((value,index)=> {
                   
                    return <option key={index} value={value}>{value}</option>
                })}
            </select>
            <input onChange={(e) => {setAddress(e.target.value)}} placeholder='Address' value={address}></input>
            <button onClick={approve}>Approve</button>
            </div>}
        </div>
    );
}

export default Garage;