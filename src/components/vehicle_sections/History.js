import { Stack, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import '../../styles/History.css';
import { callViewChainFunction, getContractFor, getNetworkExplorer } from '../utils/GatewayParser';
import { MdSpeed } from "react-icons/md";

/**
 * Component used for listing the history of the vehicle aka its owners.
 * @param vehicle the vehicle in question
 */
const History = ({ vehicle }) => {

    const data = useSelector((state) => state.data);
    const blockchain = useSelector((state) => state.blockchain);
    const [vehicleHistory, setVehicleHistory] = useState({});
    const [odometerValue, setOdometerValue] = useState(0);

    useEffect(async () => {

        const getVehicleHistory = async (events) => {
            var vehicleHistory = {}
            for (var event of events) {
                var timestamp = (await blockchain.web3.eth.getBlock(event.blockHash)).timestamp
                vehicleHistory[timestamp] = {}
                vehicleHistory[timestamp].from = event.returnValues.from
                vehicleHistory[timestamp].to = event.returnValues.to
                vehicleHistory[timestamp].transactionHash = event.transactionHash
            }
            setVehicleHistory(vehicleHistory)
        }

        (await getContractFor("events", "Transfer")).getPastEvents(
            'Transfer',
            {
                filter: { tokenId: vehicle.injected.id },
                fromBlock: 0,
                toBlock: 'latest'
            },
            (err, events) => {
                getVehicleHistory(events)
            }
        )

        setOdometerValue(await callViewChainFunction("getOdometerValue", [vehicle.injected.id]))

    }, [data.allVehicles])


    function getDate(timestamp) {
        var date = new Date(timestamp * 1000)
        return date.toLocaleDateString()
    }

    /**
 * Function used to open a new tab for a transaction with the provided hash
 * @param txHash the hash of the transaction
 */
    async function newTabTx(txHash) {

        var win = window.open((await getNetworkExplorer(blockchain.currentNetwork)) + "/tx/" + txHash, '_blank');
        win.focus();
    }

    async function newTabAddress(txHash) {
        var win = window.open((await getNetworkExplorer(blockchain.currentNetwork)) + "/address/" + txHash, '_blank');
        win.focus();
    }



    return (
        <Stack margin={3} display="flex" alignItems="center" justifyContent="center">
            <p>Total distance traveled: </p>
            <MdSpeed></MdSpeed>
            <p>{odometerValue} km</p>

            <div className="history">
                {Object.keys(vehicleHistory).map((time, index) => {
                    return (

                        <div key={index} className="history-event">
                            <label className="history-icon"></label>
                            <div className="history-info">
                                <p onClick={async () => { newTabTx(vehicleHistory[time]?.transactionHash) }} className="history-date">{getDate(time)}</p>
                                <Typography sx={{
                                    color: "black",
                                    fontWeight: "100",
                                    fontSize: "1.55em",
                                    cursor: "true"
                                }} onClick={async () => { newTabAddress(vehicleHistory[time]?.to) }} >{(vehicleHistory[time]?.to).slice(0, 7) + "..." + (vehicleHistory[time]?.to).slice((vehicleHistory[time]?.to).length - 5, (vehicleHistory[time]?.to).length)}</Typography>
                                <Typography sx={{
                                    color: "black",
                                    fontWeight: "100",
                                    fontSize: "0.75em",
                                    cursor: "true"
                                }}>Proprietor</Typography>
                            </div>

                        </div>

                    )

                })}
            </div>
        </Stack>
    );
}

export default History;