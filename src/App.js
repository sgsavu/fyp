import React, { Component } from 'react';
import Web3 from 'web3'
import Vehicle from './abis/Vehicle.json'
import { render } from 'react-dom';
import Dropzone from 'react-dropzone'
import { create } from "ipfs-http-client";

const ipfsClient = create("https://ipfs.infura.io:5001/api/v0");
const ipfsBaseUrl = "https://ipfs.infura.io/ipfs/";


class App extends Component {



  constructor(props) {
    super(props)

    this.state = {
      contract: null,
      web3: null,
      buffer: null,
      account: null,
      tokens: [],
      NFTS: [],
    }
  }


  ayee = (prm) => {

    this.setState({
      NFTS: [...this.state.NFTS, prm]
    })

    console.log(this.state.NFTS)
  }

  fetchMetatDataForNFTS = () => {
    this.state.tokens.forEach((nft) => {
      fetch(nft)
        .then(response => response.json())
        .then(data => this.ayee(data));

    });
  };


  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Vehicle.networks[networkId]
    if (networkData) {
      const contract = new web3.eth.Contract(Vehicle.abi, networkData.address)
      this.setState({ contract })

    } else {
      window.alert('Smart contract not deployed to detected network.')
    }

    console.log(this.state.account, this.state.contract)

    window.ethereum.on("accountsChanged", (accounts) => {
      window.location.reload();
    });
    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });

    const myBalance = await this.state.contract.methods.balanceOf(this.state.account).call()

    for (var i = 0; i < myBalance; i++) {
      let token = await this.state.contract.methods.tokenOfOwnerByIndex(this.state.account, i).call()
      let uri = await this.state.contract.methods.tokenURI(token).call()
      this.setState({
        tokens: [...this.state.tokens, uri]
      })
    }
   
    this.fetchMetatDataForNFTS(this.state.tokens)

  }

  mint = (_uri) => {
    this.state.contract.methods
      .mint(_uri)
      .send({ from: this.state.account })
      .once("error", (err) => {
        console.log(err);
        //setLoading(false);
        //setStatus("Error");
      })
      .then((receipt) => {
        console.log(receipt);
        //setLoading(false);
        //dispatch(fetchData(blockchain.account));
        //setStatus("Successfully minting your NFT");
      });
  };


  startMintingProcess = () => {
    const color = this.createAttribute("Color", "black")
    const body = this.createAttribute("Body", "black")
    const transmission = this.createAttribute("Transmission", "black")
    const mileage = this.createAttribute("Transmission", "black")
    const fuel = this.createAttribute("Transmission", "black")
    const engine = this.createAttribute("Transmission", "black")
    const doors = this.createAttribute("Transmission", "black")
    const seats = this.createAttribute("Transmission", "black")
    const attributes = [color, body, transmission, mileage, fuel, engine, doors, seats]
    this.createMetaDataAndMint("aye", "ayeee", this.state.buffer, attributes);
  };

  createAttribute = (type, value) => {
    return {
      trait_type: type,
      value: value
    }
  }

  createMetaDataAndMint = async (_name, _des, _imgBuffer, _attributes) => {
    // setLoading(true);
    //setStatus("Uploading to IPFS");
    try {
      const addedImage = await ipfsClient.add(_imgBuffer);

      const metaDataObj = {
        name: _name,
        description: _des,
        image: ipfsBaseUrl + addedImage.path,
        attributes: _attributes
      };
      const addedMetaData = await ipfsClient.add(JSON.stringify(metaDataObj));
      console.log(ipfsBaseUrl + addedMetaData.path);
      this.mint(ipfsBaseUrl + addedMetaData.path);
    } catch (err) {
      console.log(err);
      //setLoading(false);
      //("Error");
    }
  };

  onDrop = (file) => {

    const reader = new FileReader();
    reader.onload = (event) => {
      
      console.log(reader.result)
      this.setState({ buffer: Buffer(reader.result.split(",")[1],"base64") })
      console.log('buffer', this.state.buffer)
    };
    reader.readAsDataURL(file[0]);

  }

  render() {
    return (
      <div className="text-center mt-5">
        <Dropzone onDrop={this.onDrop}>
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive ? "Drop it like it's hot!" : 'Click me or drag a file to upload!'}
            </div>
          )}
        </Dropzone>
        <button onClick={this.startMintingProcess}>
          MINT
        </button>
        <div>
          {this.state.NFTS.map((NFT, key) => {
            return (
              <div key={key}>
                <div>Name: {NFT.name}</div>
                <div>Description: {NFT.description}</div>
                <div>Image: 
                <img src={NFT.image} width="100px" height="100px" /> </div>
               
              </div>
            )
          })}
        </div>
      </div>
    );
  }
}

export default App;