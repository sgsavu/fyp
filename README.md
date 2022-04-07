## Instructions
Node version: v14.18.1
NPM version: 6.14.15

You can find the deployed addresses of the smart contracts by ctrl+f for "networks" inside the smart contract
JSON file in /src/api/resources


PREREQUISITES:
- Chromium browser (I recommend Brave or Chrome): https://brave.com/
- Metamask wallet extension for Chromium based browsers: https://metamask.io/
- Node.js/NPM: https://nodejs.org/en/ 

The ecosystem is deployed on 2 networks (hopefully one of those will be up on the day you are testing it):
- Fantom Testnet
- Rinkeby Testnet (no example vehicles included)

**EASY MODE**

Here is the master account with all functionality enabled aka the deployer:
- PUBLIC ADDRESS: 0x41F71840346605b60B12CCaa19f7842c869f0095
- PRIVATE KEY: 3e4f26cb570f3db2f744b90862882578f5bce24b10de35ad947bf13b0c3ccebd

Create a new MetaMask Wallet
Click on the avatar picture -> Import Account -> Paste the Private key

App is running at https://fyp.sgsavu.com or https://fyp2.sgsavu.com

After you are connected to the app, added the network and switched to it, refresh the page.

Enjoy.


**INTERMEDIATE MODE:**

If you use docker you can get the container for the project from my AWS:

public.ecr.aws/q4m8f1t4/vhc3

Run on port 3000/8000/8080

**HARD MODE:**

You will need to create a fresh metamask wallet (reinstall extension). 

You will need to add some test cryptocurrency to be able to send transactions to the blockchain (simply input your public address from your metamask wallet into the following websites):
- for the Fantom chain: https://faucet.fantom.network/
- for the Rinkeby chain: https://rinkebyfaucet.com/

Metamask comes with only the Ethereum Mainnet chain by default. My app will ask you to add the 2 networks it is deployed on to be able to function.

Inside the sgs020 directory run the following command to install all required dependencies:
```sh
npm install
```

To test the app:
```sh
npm run app
```

To test the api:
```sh
npm run api
```
The api uses the private key to authenticate for the transactions since we cannot use a browser extension there. 
Please refer to the API documentation which I have made available at: https://armenz-savu.gitbook.io/api-docs/
To find your private key go to the vertical three dot menu in metamask -> Account Details -> Export Private key


You will have to modify the .env file MNEMONIC variable to match your metamask wallet's mnemonic.
You can find your metamask mnemonic by clicking on the randomly generated profile picture for your account -> Settings -> Security & Privacy -> Reveal Secret Recovery Phrase

Remember that the top account in your wallet will become the master address. (remember to also have enough testing cryptocurrency for the network you are deploying to)

To redeploy the contracts run the following command:

NAME_OF_THE_NETWORK can either be fantom or rinkeby.

```sh
truffle migrate --reset --network [NAME_OF_THE_NETWORK]
```

Now you are the DEFAULT_ADMIN over the smart contracts and can give/revoke permissions to other addresses.
I recommend creating a couple more new metamask accounts and testing features out going back to the instructions of easy mode. You can create new accounts by clicking on your profile icon then Create Account. Remember to adequately equip each account with testing cryptocurrency.


**TESTING ODOMETER SCRIPT**

To test the python IoT script:

```sh
./iot/load_python_libraries.sh
```

```sh
python3 ./iot/iot.py
```
