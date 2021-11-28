from web3 import Web3
import json
import sched, time


with open("C:/sgs020/src/abis/ExternalGateway.json") as f:
    info_json = json.load(f)

abi = info_json["abi"]
address = Web3.toChecksumAddress(info_json["networks"]["5777"]["address"])

web3 = Web3(Web3.HTTPProvider('http://127.0.0.1:7545'))

web3.eth.default_account= web3.eth.accounts[0]


contract  = web3.eth.contract(address=address,abi=abi)

print (contract.functions.getIfTokenExists(5).call())

def increment_odometer(vehicleId):
    contract.functions.incrementOdometer(vehicleId).transact()




s = sched.scheduler(time.time, time.sleep)
def do_something(sc): 
    print("Doing stuff...")
    s.enter(10, 1, do_something, (sc,))

s.enter(10, 1, do_something, (s,))
s.run()