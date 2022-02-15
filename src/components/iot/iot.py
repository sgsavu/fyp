from web3 import Web3
import json
import sched
import time


PRIVATE_KEY = "ceddfa13d00d47e636b7f36203d29197c4f9b3a0b47766ba5e8bf214ede7daff"

with open("C:/sgs020/src/abis/ExternalGateway.json") as f:
    info_json = json.load(f)

web3 = Web3(Web3.HTTPProvider(
    'https://ropsten.infura.io/v3/a4e7eec756004287a7b715dbe92cc57c'))

contract_abi = info_json["abi"]
contract_address = Web3.toChecksumAddress(
    info_json["networks"]["3"]["address"])
contract = web3.eth.contract(address=contract_address, abi=contract_abi)


web3.eth.default_account = web3.eth.account.from_key(PRIVATE_KEY).address



def increment_odometer(value, vehicleId):
    tx = contract.functions.incrementOdometerBy(value, vehicleId).buildTransaction(
        {'nonce': web3.eth.getTransactionCount(web3.eth.default_account)})
    print(tx)
    signed_tx = web3.eth.account.signTransaction(tx, private_key=PRIVATE_KEY)
    print(signed_tx)
    web3.eth.sendRawTransaction(signed_tx.rawTransaction)


s = sched.scheduler(time.time, time.sleep)


def do_something(sc):
    print("Doing stuff...")
    s.enter(10, 1, do_something, (sc,))


s.enter(10, 1, do_something, (s,))
s.run()
