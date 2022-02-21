from web3 import Web3
import json
import sched
import time


PRIVATE_KEY = "3f91e9e358b16585c445f8fd6e6edc67a6ee07aa4f422c25d82c4d24b2a507e1"

web3 = Web3(Web3.HTTPProvider(
    'https://rpc.testnet.fantom.network/'))

with open("C:/sgs020/src/abis/ExternalGateway.json") as f:
    info_json = json.load(f)

contract_abi = info_json["abi"]
contract_address = Web3.toChecksumAddress(
    info_json["networks"]["4002"]["address"])
contract = web3.eth.contract(address=contract_address, abi=contract_abi)


web3.eth.default_account = web3.eth.account.from_key(PRIVATE_KEY).address



def increment_odometer(vehicleId, value):
    tx = contract.functions.increaseOdometer(vehicleId, value).buildTransaction(
        {'nonce': web3.eth.getTransactionCount(web3.eth.default_account)})
    print("tx",tx)
    signed_tx = web3.eth.account.signTransaction(tx, private_key=PRIVATE_KEY)
    print("stx",signed_tx)
    web3.eth.sendRawTransaction(signed_tx.rawTransaction)


s = sched.scheduler(time.time, time.sleep)


def do_something(sc):
    increment_odometer(0,10)
    s.enter(10, 1, do_something, (sc,))


s.enter(10, 1, do_something, (s,))
s.run()
