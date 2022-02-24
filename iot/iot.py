from itertools import chain
from web3 import Web3
import os
import json
import sched
import time
from web3.middleware import geth_poa_middleware
import requests
import sys
from dotenv import load_dotenv
import obd 
from elm import Elm
import random

LOOPIG_TIME = 1
LOCAL_ODOMETER = 0
ODOMETER_LOAD = 0
TRANSACTION_THRESHOLD = 0.5 #in kilometers
TRANSACTION_WINDOW = False

__location__ = os.path.realpath(
    os.path.join(os.getcwd(), os.path.dirname(__file__)))

def refresh_cache():
    pass

def load_environment_file():
    global PRIVATE_KEY
    global VEHICLE_ID
    global CHAIN
    PRIVATE_KEY = os.environ['PRIVATE_KEY']
    VEHICLE_ID = int(os.environ['VEHICLE_ID'])
    CHAIN = os.environ['CHAIN']

def load_default_cache():
    global external_gateway
    global network_table
    external_gateway = json.load(
        open(os.path.join(__location__, 'ExternalGateway.json')))
    network_table = json.load(
        open(os.path.join(__location__, 'NetworkTables.json')))

def load_web3():
    global web3
    global nonce
    web3 = Web3(Web3.HTTPProvider(network_table[CHAIN]["rpcUrls"][0]))
    web3.eth.default_account = web3.eth.account.from_key(PRIVATE_KEY).address
    web3.middleware_onion.inject(geth_poa_middleware, layer=0)
    nonce = web3.eth.getTransactionCount(web3.eth.default_account)

def load_contract():
    global contract
    contract_abi = external_gateway["abi"]
    contract_address = Web3.toChecksumAddress(
        external_gateway["networks"][str(Web3.toInt(hexstr=CHAIN))]["address"])
    contract = web3.eth.contract(address=contract_address, abi=contract_abi)

def init ():
    load_dotenv()
    load_environment_file()
    load_default_cache()
    load_web3()
    load_contract()

def increment_odometer(value):
    global nonce
    global TRANSACTION_WINDOW
    global ODOMETER_LOAD
    tx = contract.functions.increaseOdometer(VEHICLE_ID, value).buildTransaction(
        {'nonce': nonce})
    signed_tx = web3.eth.account.signTransaction(tx, private_key=PRIVATE_KEY)
    web3.eth.sendRawTransaction(signed_tx.rawTransaction)
    print("SENT" + str(ODOMETER_LOAD) + str(signed_tx))
    nonce = nonce + 1
    ODOMETER_LOAD = 0
    TRANSACTION_WINDOW = False

def activate_window():
    global TRANSACTION_WINDOW
    if TRANSACTION_WINDOW is False:
        TRANSACTION_WINDOW = True

def loop_forever(sc):
    global LOCAL_ODOMETER
    global ODOMETER_LOAD
    global TRANSACTION_WINDOW
    global TRANSACTION_THRESHOLD
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
                    increment_odometer(1)
            print(str(LOCAL_ODOMETER))

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



        
    



