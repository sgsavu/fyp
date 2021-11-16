const { assert } = require('chai')

const Vehicle = artifacts.require('./Vehicle.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Vehicle', (accounts) => {

  let contract
  
  before(async () => {
    contract = await Vehicle.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = contract.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has correct name', async () => {
      const name = await contract.name()
      assert.equal(name, 'Vehicle')
    })

    it('has correct symbol', async () => {
      const symbol = await contract.symbol()
      assert.equal(symbol, 'VHC')
    })

    it('has 0 tokens', async () => {
        const supply = await contract.totalSupply()
        assert.equal(supply, 0)
      })

  })


  describe('minting', async () => {

    it('creates a new token', async () => {
      const result = await contract.mint('https://sgsavu.com')
      const result2 = await contract.mint('https://sgsavu.comsadgsda')
      const totalSupply = await contract.totalSupply()
      console.log(await contract.isForSale(0))
      await contract.setForSale(0,true)
      console.log(await contract.isForSale(0))
      console.log(await contract.isForSale(1))
      await contract.setForSale(1,true)
      console.log(await contract.isForSale(1))

  

  

      //await contract.mint('https://sgsavu.com').should.be.rejected;
    })
  })


})
