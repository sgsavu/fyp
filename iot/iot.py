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

TIME = 1 #in seconds
ODOMETER = 0 #in kilometers
THRESHOLD = 1 #in kilometers
REFRESH_COOLDOWN = 0
HANDICAP = 10 #in percentage

__location__ = os.path.realpath(
    os.path.join(os.getcwd(), os.path.dirname(__file__)))

def restart_device():
    os.system("reboot")

# REFRESHING

def check_refresh():
    return management_contract.functions.getRefreshCache().call()

def check_restart():
    return management_contract.functions.getRestart().call()

def decrement_refresh_cooldown():
    global REFRESH_COOLDOWN
    if REFRESH_COOLDOWN != 0:
        REFRESH_COOLDOWN = REFRESH_COOLDOWN - 1

def refresh_file(file):
    REST_API_LINK = "https://" + management_contract.functions.getApiAddress().call()
    response = requests.get(REST_API_LINK, data={'operation':'getFile','file':file["contractName"]}, verify=False)
    initial_file = file
    new_file = response.json()['result']
    if initial_file != new_file:
        with open(__location__ + '/' + file["contractName"] + '.json', "w") as myfile:
            myfile.write(json.dumps(new_file))
        return 1
    else:
        return 0

def refresh_cache():
    global REFRESH_COOLDOWN
    global odometer
    global management
    global network_tables

    new_odometer = refresh_file(odometer)
    new_management = refresh_file(management)
    new_network_tables = refresh_file(network_tables)

    if new_odometer:
        rollover_odometer()

    if new_odometer == 1 or new_management == 1 or new_network_tables == 1:
        init()

    REFRESH_COOLDOWN = random.randrange(5,30)

#INIT

def load_environment_file():
    global PRIVATE_KEY
    global VEHICLE_ID
    global CHAIN

    PRIVATE_KEY = os.environ['PRIVATE_KEY']
    VEHICLE_ID = int(os.environ['VEHICLE_ID'])
    CHAIN = os.environ['CHAIN']

def load_cache():
    global odometer
    global management
    global network_tables

    with open(__location__ + '/Odometer.json') as myfile:
        odometer = json.load(myfile)

    with open(__location__ + '/Management.json') as myfile:
        management = json.load(myfile)

    with open(__location__ + '/NetworkTables.json') as myfile:
        network_tables = json.load(myfile)

def load_web3():
    global web3
    web3 = Web3(Web3.HTTPProvider(network_tables[CHAIN]["rpcUrls"][0]))
    web3.eth.default_account = web3.eth.account.from_key(PRIVATE_KEY).address
    web3.middleware_onion.inject(geth_poa_middleware, layer=0)

def create_contract(contract_file):
    abi = contract_file["abi"]
    addr = Web3.toChecksumAddress(
        contract_file["networks"][str(Web3.toInt(hexstr=CHAIN))]["address"])
    return web3.eth.contract(address=addr, abi=abi)

def load_contracts():
    global odometer_contract
    global management_contract
    odometer_contract = create_contract(odometer)
    management_contract = create_contract(management)

def init ():
    load_dotenv()
    load_environment_file()
    load_cache()
    load_web3()
    load_contracts()

# BREAD AND BUTTER

def rollover_odometer():
    global ODOMETER
    ODOMETER = ODOMETER + odometer_contract.functions.getOdometerValue(VEHICLE_ID).call()

def increment_odometer():
    global ODOMETER

    floored = math.floor(ODOMETER)

    tx = odometer_contract.functions.increaseOdometer(VEHICLE_ID, floored).buildTransaction(
        {'nonce': web3.eth.getTransactionCount(web3.eth.default_account)})
    signed_tx = web3.eth.account.signTransaction(tx, private_key=PRIVATE_KEY)
    web3.eth.sendRawTransaction(signed_tx.rawTransaction)

    print("SENT " + str(floored))
    ODOMETER = ODOMETER - floored

def loop_forever(sc):
    global ODOMETER
    global THRESHOLD

    decrement_refresh_cooldown()

    try:
        if check_restart():
            restart_device()
    except Exception as e: print(e)

    try:
        if check_refresh():
            if REFRESH_COOLDOWN == 0:
                refresh_cache()
    except Exception as e: print(e)

    try:
        raw_reading = float(str(connection.query(obd.commands.SPEED).value)[:-4])
        if raw_reading != 0.0:
            distance = raw_reading*TIME/3600
            ODOMETER = ODOMETER + distance
            if ODOMETER>THRESHOLD:
                print("WINDOW ACTIVE")
                random_num = random.random()
                if (random_num>((100-HANDICAP)/100)):
                    increment_odometer()

        print("PULL CD: " + str(REFRESH_COOLDOWN))
        print("ODOMETER: " + str(ODOMETER) + " SPEED: " + str(raw_reading))

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



        
    



