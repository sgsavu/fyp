from web3 import Web3
import json
import sched
import time

PRIVATE_KEY = "ceddfa13d00d47e636b7f36203d29197c4f9b3a0b47766ba5e8bf214ede7daff"
VEHICLE_ID = 6
NETWORK_RPC_URL = "https://rpc.testnet.fantom.network/"
NETWORK_ID = "4002"
CONTRACT_ADDRESS = "C:/sgs020/src/abis/ExternalGateway.json"

web3 = Web3(Web3.HTTPProvider(
    NETWORK_RPC_URL))
with open(CONTRACT_ADDRESS) as f:
    info_json = json.load(f)
contract_abi = info_json["abi"]
contract_address = Web3.toChecksumAddress(
    info_json["networks"][NETWORK_ID]["address"])
contract = web3.eth.contract(address=contract_address, abi=contract_abi)
web3.eth.default_account = web3.eth.account.from_key(PRIVATE_KEY).address


def increment_odometer(vehicleId, value):
    tx = contract.functions.increaseOdometer(vehicleId, value).buildTransaction(
        {'nonce': web3.eth.getTransactionCount(web3.eth.default_account)})
    print("tx", tx)
    signed_tx = web3.eth.account.signTransaction(tx, private_key=PRIVATE_KEY)
    print("stx", signed_tx)
    web3.eth.sendRawTransaction(signed_tx.rawTransaction)


s = sched.scheduler(time.time, time.sleep)


def do_something(sc):
    increment_odometer(VEHICLE_ID, 10)
    s.enter(10, 1, do_something, (sc,))


s.enter(10, 1, do_something, (s,))
s.run()
