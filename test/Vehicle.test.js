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
      const totalSupply = await contract.totalSupply()

      assert.equal(totalSupply, 1, 'number of tokens correct')

      const event = result.logs[0].args
      assert.equal(event.tokenId.toNumber(), 0, 'tokenId is correct')
      assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
      assert.equal(event.to, accounts[0], 'to is correct')

      const name = await contract.tokenURI(0)
      assert.equal(name,"https://sgsavu.com", 'uri is correct')

      //await contract.mint('https://sgsavu.com').should.be.rejected;
    })
  })

  describe('indexing', async () => {
    it('lists vehicles', async () => {

      await contract.mint('https://sgsavu.com')
      const event = await contract.mint('https://sgsavu.com',{ from: accounts[1] })
      const event2 = await contract.mint('https://sgsavu.com')

      assert.equal(event.logs[0].args.to, accounts[1])
      assert.equal(event2.logs[0].args.to, accounts[0])

      const totalSupply = await contract.totalSupply()
      assert.equal(totalSupply, 4, 'number of tokens correct')

      for (var i = 0; i < totalSupply; i++) {
        const vehicle = await contract.tokenURI(i)
        console.log(vehicle)
      }
    })

    it ('finds correct balance', async() =>{
      const event = await contract.balanceOf(accounts[0])
      const event2 = await contract.balanceOf(accounts[1])
      assert.equal(event.words[0], 3)
      assert.equal(event2.words[0], 1)
    })

    it ('lists my tokens', async() =>{
      const event0 = await contract.balanceOf(accounts[1])
      const allMyTokens = event0.words[0]

      for (var i = 0; i < allMyTokens; i++) {
        const vehicle = await contract.tokenOfOwnerByIndex(accounts[1],i)
        console.log(vehicle)
      }

    
    })

  })


})
