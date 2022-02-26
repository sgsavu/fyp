import os
import json
import sched
import time
import requests
import sys
import random
from dotenv import load_dotenv
from web3 import Web3
from web3.middleware import geth_poa_middleware
import obd 
from elm import Elm
import math

REST_API_LINK = "https://localhost:8443/"
LOOPIG_TIME = 1
LOCAL_ODOMETER = 0
ODOMETER_LOAD = 0
TRANSACTION_THRESHOLD = 1 #in kilometers
TRANSACTION_WINDOW = False
PULL_COOLDOWN = 0

__location__ = os.path.realpath(
    os.path.join(os.getcwd(), os.path.dirname(__file__)))

print(__location__)

def restart_device():
    os.system("reboot")

def decrement_pull_cooldown():
    global PULL_COOLDOWN
    if PULL_COOLDOWN != 0:
        PULL_COOLDOWN = PULL_COOLDOWN - 1

def refresh_cache():
    global PULL_COOLDOWN
    print("refreeshing cache")
    refresh_contract()
    refresh_network_tables()
    init()
    PULL_COOLDOWN = 30

def refresh_contract():
    global external_gateway
    response = requests.get(REST_API_LINK, data={'operation':'getContract'}, verify=False)
    external_gateway = response.json()['result']
    with open(__location__ + '/ExternalGateway.json', "w") as myfile:
        myfile.write(json.dumps(external_gateway))

def refresh_network_tables():
    global network_tables
    response = requests.get(REST_API_LINK, data={'operation':'getNetworkTables'}, verify=False)
    network_tables = response.json()['result']
    with open(__location__ + '/NetworkTables.json', "w") as myfile:
        myfile.write(json.dumps(network_tables))

def load_environment_file():
    global PRIVATE_KEY
    global VEHICLE_ID
    global CHAIN
    PRIVATE_KEY = os.environ['PRIVATE_KEY']
    VEHICLE_ID = int(os.environ['VEHICLE_ID'])
    CHAIN = os.environ['CHAIN']

def load_cache():
    global external_gateway
    global network_tables

    with open(__location__ + '/ExternalGateway.json') as myfile:
        external_gateway = json.load(myfile)

    with open(__location__ + '/NetworkTables.json') as myfile:
        network_tables = json.load(myfile)
  


def load_web3():
    global web3
    web3 = Web3(Web3.HTTPProvider(network_tables[CHAIN]["rpcUrls"][0]))
    web3.eth.default_account = web3.eth.account.from_key(PRIVATE_KEY).address
    web3.middleware_onion.inject(geth_poa_middleware, layer=0)

def load_contract():
    global contract
    contract_abi = external_gateway["abi"]
    contract_address = Web3.toChecksumAddress(
        external_gateway["networks"][str(Web3.toInt(hexstr=CHAIN))]["address"])
    contract = web3.eth.contract(address=contract_address, abi=contract_abi)

def init ():
    load_dotenv()
    load_environment_file()
    load_cache()
    load_web3()
    load_contract()

def increment_odometer():
    global TRANSACTION_WINDOW
    global ODOMETER_LOAD

    floored = math.floor(ODOMETER_LOAD)

    tx = contract.functions.increaseOdometer(VEHICLE_ID, floored).buildTransaction(
        {'nonce': web3.eth.getTransactionCount(web3.eth.default_account)})
    signed_tx = web3.eth.account.signTransaction(tx, private_key=PRIVATE_KEY)
    web3.eth.sendRawTransaction(signed_tx.rawTransaction)

    print("SENT " + str(floored))
    ODOMETER_LOAD = ODOMETER_LOAD - floored
    TRANSACTION_WINDOW = False

def check_if_pull_cache():
    wow = contract.functions.getPullCache().call()
    print("Cache " + str(wow))
    return wow

def check_if_restart():
    wow = contract.functions.getRestart().call()
    print("Restart " + str(wow))
    return wow

def activate_window():
    global TRANSACTION_WINDOW
    if TRANSACTION_WINDOW is False:
        TRANSACTION_WINDOW = True

def loop_forever(sc):
    global LOCAL_ODOMETER
    global ODOMETER_LOAD
    global TRANSACTION_WINDOW
    global TRANSACTION_THRESHOLD

    decrement_pull_cooldown()

    try:
        if check_if_restart():
            restart_device()
    except Exception as e: print(e)

    try:
        if check_if_pull_cache():
            if PULL_COOLDOWN == 0:
                refresh_cache()
    except Exception as e: print(e)

    try:
        raw_reading = float(str(connection.query(obd.commands.SPEED).value)[:-4])
        if raw_reading != 0.0:
            distance = raw_reading*LOOPIG_TIME/3600
            LOCAL_ODOMETER = LOCAL_ODOMETER + distance
            ODOMETER_LOAD = ODOMETER_LOAD + distance
            if ODOMETER_LOAD>TRANSACTION_THRESHOLD:
                activate_window()
            if TRANSACTION_WINDOW:
                print("WINDOW ACTIVE")
                random_num = random.random()
                if (random_num>0.90):
                    increment_odometer()
        print("PULL CD: " + str(PULL_COOLDOWN))
        print("TOTAL: " + str(LOCAL_ODOMETER) + " LOAD: " + str(ODOMETER_LOAD) + " SPEED: " + str(raw_reading))

    except Exception as e: print(e)
    s.enter(1, 1, loop_forever, (sc,))


with Elm() as session:
    pty = session.get_pty()
    connection = obd.OBD(pty)
    s = sched.scheduler(time.time, time.sleep)
    s.enter(0, 1, init)
    s.enter(5, 1, loop_forever, (s,))
    s.run() 

'''
connection = obd.OBD()
s = sched.scheduler(time.time, time.sleep)
s.enter(0, 1, init)
s.enter(5, 1, loop_forever, (s,))
s.run() 
'''



        
    



