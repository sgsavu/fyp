## Instructions

PREREQUISITES:
- Chromium browser (I recommend Brave or Chrome): https://brave.com/
- Metamask wallet extension for Chromium based browsers: https://metamask.io/
- Node.js/NPM: https://nodejs.org/en/ 

I will deploy the smart contracts myself and then commit them in the github repo for you to test (this is the EASY mode and enables you to see the system from the point of view of a normal USER). However, if you wish you can redeploy the contracts and become owner over the ecosystem to test certain functionality and/or edge cases (this is the HARD mode). 

The ecosystem is deployed on 2 networks (hopefully one of those will be up on the day you are testing it):
- Fantom Testnet
- Rinkeby Testnet

You will need to add some test cryptocurrency to be able to send transactions to the blockchain (simply input your public address from your metamask wallet into the following websites):
- for the Fantom chain: https://faucet.fantom.network/
- for the Rinkeby chain: https://rinkebyfaucet.com/

Metamask comes with only the Ethereum Mainnet chain by default. My app will ask you to add the 2 networks it is deployed on to be able to function.

Inside the sgs020 directory run the following command to install all required dependencies:
```sh
npm install
```

**EASY MODE**

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


To test the python IoT script:

```sh
./iot/load_python_libraries.sh
```

```sh
python3 ./iot/iot.py
```

**HARD MODE:**

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


