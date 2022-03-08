import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import '../../styles/History.css';
import { getNetworkExplorer } from '../utils/BlockchainGateway';

const History = ({ vehicle }) => {

    const data = useSelector((state) => state.data);
    const blockchain = useSelector((state) => state.blockchain);
    const [vehicleHistory, setVehicleHistory] = useState({});

    useEffect(async () => {

        const getVehicleHistory = async (events) => {
            var vehicleHistory = {}
            console.log(events)
            for (var event of events) {
                var timestamp = (await blockchain.web3.eth.getBlock(event.blockHash)).timestamp
                vehicleHistory[timestamp] = {}
                vehicleHistory[timestamp].from = event.returnValues.from
                vehicleHistory[timestamp].to = event.returnValues.to
                vehicleHistory[timestamp].transactionHash = event.transactionHash
            }
            setVehicleHistory(vehicleHistory)
        }

        (blockchain.smartContracts)[1].getPastEvents(
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

    }, [data.myVehicles, data.allVehicles, data.saleVehicles])


    function getDate(timestamp) {
        var date = new Date(timestamp * 1000)
        return date.toLocaleDateString()
    }

    async function newTabTx(txHash) {
        
        var win = window.open((await getNetworkExplorer(blockchain.currentNetwork)) + "/tx/" + txHash, '_blank');
        win.focus();
    }

    async function newTabAddress(txHash) {
        var win = window.open((await getNetworkExplorer(blockchain.currentNetwork)) + "/address/" + txHash, '_blank');
        win.focus();
    }

    

    return (
        <div>
            <div class="timeline">
                {Object.keys(vehicleHistory).map((time, index) => {
                    return (
                        <div>
                            <div key={index} class="timeline-event">
                                <label class="timeline-event-icon"></label>
                                <div class="timeline-event-info">
                                    <p onClick={async () => { newTabTx(vehicleHistory[time]?.transactionHash) }} class="timeline-event-date">{getDate(time)}</p>
                                    <h4 onClick={async () => { newTabAddress(vehicleHistory[time]?.to) }} >{(vehicleHistory[time]?.to).slice(0, 9) + "..." + (vehicleHistory[time]?.to).slice((vehicleHistory[time]?.to).length - 10, (vehicleHistory[time]?.to).length)}</h4>
                                    <h6>Proprietor</h6>
                                </div>

                            </div>
                            <div key={index} class="timeline-event">
                                <label class="timeline-event-icon"></label>
                                <div class="timeline-event-info">
                                    <p onClick={async () => { newTabTx(vehicleHistory[time]?.transactionHash) }} class="timeline-event-date">{getDate(time)}</p>
                                    <h4 >{(vehicleHistory[time]?.to).slice(0, 9) + "..." + (vehicleHistory[time]?.to).slice((vehicleHistory[time]?.to).length - 10, (vehicleHistory[time]?.to).length)}</h4>
                                    <h6>Proprietor</h6>
                                </div>

                            </div>
                            <div key={index} class="timeline-event">
                                <label class="timeline-event-icon"></label>
                                <div class="timeline-event-info">
                                    <p onClick={async () => { newTabTx(vehicleHistory[time]?.transactionHash) }} class="timeline-event-date">{getDate(time)}</p>
                                    <h4 >{(vehicleHistory[time]?.to).slice(0, 9) + "..." + (vehicleHistory[time]?.to).slice((vehicleHistory[time]?.to).length - 10, (vehicleHistory[time]?.to).length)}</h4>
                                    <h6>Proprietor</h6>
                                </div>

                            </div>
                        </div>
                    )

                })}
            </div>
        </div>
    );
}

export default History;