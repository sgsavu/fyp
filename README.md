## Instructions

**Step 0:** I recommend using a Chromium based browser (eg. Brave, Chrome). Make sure you are in the sgs020 directory.

**Step 1:** Install Metamask Wallet extension for your browser (this will be used to interact/make transactions with the blockchain):

https://metamask.io/

**Step 2:** Install Truffle the framework for blockchain development:
```sh
npm install -g truffle
```


**Step 3:** Install Ganache (a blockchain emulator/personal/local blockchain for testing):

https://www.trufflesuite.com/ganache

OR 

```sh
npm install -g ganache-cli
```
OR 

```sh
yarn global add ganache-cli
```

**Step 4:** Install all other necessary dependencies and packages from package.json (using Node.js) by running:
```sh
npm install
```

**Step 4:** Run Ganache (client or CLI) and make sure that the port in truffle-config.js on line 46 is the same as the port displayed in Ganache
****
**Step 5:** Compile the smart contracts and deploy them to the blockchain by running:
```sh
trufle migrate --reset
```

**Step 6:** Setup MetaMask to work with our app:
- Open MetaMask extension in your browser and change from the Ethereum Mainnet (by default) to the localhost xxxx
- Click on the top right colorful circle and Import the first 2 ganache Accounts by copying their private keys
    - if you are using the Ganache Client the key can be obtained by clicking the key icon next to each account entry
    - if you are using the CLI the keys will be shown in your terminal when you run it in step 4 (additionally every time you run ganache-cli you will have to import the new keys)
    - metamask will ask you to connect to the app once it detects it 


**Step 7:** Start the React app by running:
```sh
npm start
```
or
```sh
npm start run
```
or
```sh
npm run start
```
