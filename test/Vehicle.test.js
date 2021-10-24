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
      const result = await contract.mint('B90EWZ')
      const totalSupply = await contract.totalSupply()

      assert.equal(totalSupply, 1, 'number of tokens correct')

      const event = result.logs[0].args
      assert.equal(event.tokenId.toNumber(), 1, 'tokenId is correct')
      assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
      assert.equal(event.to, accounts[0], 'to is correct')

      const name = await contract.getVehiclePlateForTokenId(1)
      assert.equal(name,"B90EWZ", 'name is correct')

      await contract.mint('B90EWZ').should.be.rejected;
    })
  })

  describe('indexing', async () => {
    it('lists vehicles', async () => {

      await contract.mint('B90EWZ2')
      const event = await contract.mint('B90EWZ3',{ from: accounts[1] })
      const event2 = await contract.mint('B90EWZ4')

      assert.equal(event.logs[0].args.to, accounts[1])
      assert.equal(event2.logs[0].args.to, accounts[0])

      const totalSupply = await contract.totalSupply()
      assert.equal(totalSupply, 4, 'number of tokens correct')

      for (var i = 1; i <= totalSupply; i++) {
        const vehicle = await contract.getVehiclePlateForTokenId(i)
        console.log(vehicle)
      }
    })

    it ('finds correct balance', async() =>{
      const event = await contract.balanceOf(accounts[0])
      const event2 = await contract.balanceOf(accounts[1])
      assert.equal(event.words[0], 3)
      assert.equal(event2.words[0], 1)
    })

  })


})
