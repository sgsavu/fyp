from web3 import Web3
import json
import sched, time


with open("C:/sgs020/src/abis/ExternalGateway.json") as f:
    info_json = json.load(f)

web3 = Web3(Web3.HTTPProvider('https://ropsten.infura.io/v3/a4e7eec756004287a7b715dbe92cc57c'))

abi = info_json["abi"]
address = Web3.toChecksumAddress(info_json["networks"]["3"]["address"])
web3.eth.default_account = "0x41F71840346605b60B12CCaa19f7842c869f0095"
print(web3.eth.default_account)

contract  = web3.eth.contract(address=address,abi=abi)


#print (contract.functions.tokenURI(0).call())


def mint():
    
    
    tx = contract.functions.createVehicle("https://bafybeie7mszl7lgvcpgjzcjvkhwzph4nrkip22wxltf3qaulpkvtderlwm.ipfs.infura-ipfs.io/").buildTransaction({'nonce': web3.eth.getTransactionCount('0x41F71840346605b60B12CCaa19f7842c869f0095')})
    print(tx)
    signed_tx = web3.eth.account.signTransaction(tx, private_key='3e4f26cb570f3db2f744b90862882578f5bce24b10de35ad947bf13b0c3ccebd')
    print("aye")
    #web3.eth.sendRawTransaction(signed_tx.rawTransaction)

mint()

def makeForSale():
    tx = contract.functions.listForSale(0,1).buildTransaction({'nonce': web3.eth.getTransactionCount('0x41F71840346605b60B12CCaa19f7842c869f0095')})
    print(tx)
    signed_tx = web3.eth.account.signTransaction(tx, private_key='3e4f26cb570f3db2f744b90862882578f5bce24b10de35ad947bf13b0c3ccebd')
    print("aye")
    web3.eth.sendRawTransaction(signed_tx.rawTransaction)

#makeForSale()

def increment_odometer(vehicleId):
    contract.functions.increaseOdometerValue(vehicleId).transact()


s = sched.scheduler(time.time, time.sleep)

def do_something(sc): 
    print("Doing stuff...")
    s.enter(10, 1, do_something, (sc,))

s.enter(10, 1, do_something, (s,))
s.run()