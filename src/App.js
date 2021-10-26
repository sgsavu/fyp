import React, { Component } from 'react';
import Web3 from 'web3'
import Vehicle from './abis/Vehicle.json'
import { render } from 'react-dom';

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
    await this.displayMyTokens()
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
    const accounts = await web3.eth.getAccounts()

    window.ethereum.on('accountsChanged', () => {
      window.location.reload()
    })

    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()
    const networkData = Vehicle.networks[networkId]
    if (networkData) {
      const abi = Vehicle.abi
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address)
      this.setState({ contract })
      const totalSupply = await contract.methods.totalSupply().call()
      this.setState({ totalSupply })
      const myBalance = await contract.methods.balanceOf(this.state.account).call()
      this.setState({ myBalance })

    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  async displayMyTokens() {

    for (var i = 0; i < this.state.myBalance; i++) {
      const vehicle = await this.state.contract.methods.tokenOfOwnerByIndex(this.state.account, i).call()
      const uri = await this.state.contract.methods.tokenURI(vehicle).call()
      this.setState({
        vehicles: [...this.state.vehicles, uri]
      })
    }
    
  }

  mint = (vehicle) => {
    this.state.contract.methods.mint(vehicle).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({
          vehicles: [...this.state.vehicles, vehicle]
        })
      })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      totalSupply: 0,
      myBalance: 0,
      vehicles: []
    }
  }


  render() {
    return (
      <div>
        <nav>
          <a>
            Vehicles
          </a>
          <ul>
            <small><span>{this.state.account}</span></small>
          </ul>
        </nav>
        <div>
          <div>
            <main role="main">
              <div >
                <h1>Issue Vehicle</h1>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const vehicle = this.vehicle.value
                  this.mint(vehicle)
                }}>
                  <input
                    type='text'
                    placeholder='e.g. https://sgsavu.com'
                    ref={(input) => { this.vehicle = input }}
                  />
                  <input
                    type='submit'
                    value='MINT'
                  />
                </form>
              </div>
            </main>
          </div>
          <hr />
          <div>
            {this.state.vehicles.map((vehicle, key) => {
              return (
                <div key={key}>
                  <div>{vehicle}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  }

}
export default App;
