const { assert } = require('chai')

const ExternalGateway = artifacts.require('./ExternalGateway.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('ExternalGateway', (accounts) => {

  let contract

  before(async () => {
    contract = await ExternalGateway.deployed()
  })


  it('creates tokens', async () => {
    const s = await contract.createVehicle('https://bafybeigbyu5kd3b3ozmjnahl6jqs3rgumhcol5wf52hfooueusfpe4tine.ipfs.infura-ipfs.io/')
    const ss = await contract.createVehicle('https://sgsavu.comsadgsda')
    const sss = await contract.createVehicle('https://sgsavu.com')
    const ssss = await contract.createVehicle('https://sgsavu.com2')

    assert.equal(await contract.totalSupply(), 4, 'number of tokens correct')

    //await contract.mint('https://sgsavu.com').should.be.rejected;
  })

  describe('vehicle for sale', async () => {
    it('lists vehicles', async () => {

      try{
        await contract.listForSale(0,400)
        await contract.bidVehicle(0,{ value: 200 })
      }
      catch (err)
      { 
        console.log(Object.keys(err)[0])
        console.log(err.data[Object.keys(err.data)[0]].reason)
      }

    })

  })
})
