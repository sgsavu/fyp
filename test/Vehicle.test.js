const { assert } = require('chai')

const Gateway = artifacts.require('Gateway')
const Vehicle = artifacts.require('Vehicle')
const Management = artifacts.require('Management')
const Roles = artifacts.require('Roles')
const Marketplace = artifacts.require('Marketplace')
const Odometer = artifacts.require('Odometer')


require('chai')
  .use(require('chai-as-promised'))
  .should()


contract('Vehicle', () => {

  let vehicle = null

  before(async () => {
    vehicle = await Vehicle.deployed()
  })

  describe('Basic func: Minting/Burning', async () => {
    it('Mints one vehicle', async () => {
      await vehicle.mint("https://sgsavu.com")
      var totalSupply = await vehicle.totalSupply()
      assert.equal(totalSupply, 1)
    });

    it('Returns the correct URI', async () => {
      var tokenURI = await vehicle.tokenURI(0)
      assert.equal(tokenURI, "https://sgsavu.com")
    });

    it('Rejects minting with same URI', async () => {
      try {
        await vehicle.mint("https://sgsavu.com")
      } catch (e) {
        assert(e.message.includes("E3"))
      }
      assert.equal(totalSupply, 1)
    });

    it('Mints another vehicle', async () => {
      await vehicle.burn("https://sgsavu.com/boss")
      assert.equal(totalSupply, 2)
    });

    it('Burns a vehicle', async () => {
      await vehicle.burn(0)
      assert.equal(totalSupply, 1)
    });

  })

  describe('Garage Func', async () => {
    it('Gets the default garage', async () => {
      var garageAddress = await vehicle.getApprovedGarage(0)
      assert.equal(garageAddress, 0x0000000000000000000000000000000000000000)
    });

    it('Sets the approved garage', async () => {
      var garageAddress = await vehicle.setApprovedGarage(0, "0xf3Def80911CB8F104090F9ce54310B8e963BB109")
      assert.equal(garageAddress, 0xf3Def80911CB8F104090F9ce54310B8e963BB109)
    });

    it('Sets a new token URI', async () => {
      await vehicle.setTokenURI(0, "randomstring")
      var tokenURI = await vehicle.tokenURI(0)
      assert.equal(tokenURI, "randomstring")
    });

    it('Resets the garage back to default', async () => {
      var garageAddress = await vehicle.getApprovedGarage(0)
      assert.equal(garageAddress, 0x0000000000000000000000000000000000000000)
    });
  })


})


contract('Gateway', () => {

  let contract = null

  before(async () => {
    contract = await Gateway.deployed()
  })

  describe('Instant func.', async () => {
    it('fails to list a vehicle with price zero', async () => {
      try {
        await contract.listInstant(0, 0)
      } catch (e) {
        assert(e.message.includes("E8"))
      }
    })

    it('lists a vehicle for sale', async () => {
      await contract.listInstant(0, 400)
      var isForSale = await contract.isForSale(0)
      assert.equal(isForSale, true)
    })

    it('fails to list a vehicle that is already listed', async () => {
      try {
        await contract.listInstant(0, 400)
      } catch (e) {
        assert(e.message.includes("E5"))
      }
    })

    it('displays the correct price', async () => {
      var price = await contract.getVehiclePrice(0)
      assert.equal(price, 400)
    })

    it('sets a new price', async () => {
      await contract.setVehiclePrice(0, 1000)
      var price = await contract.getVehiclePrice(0)
      assert.equal(price, 1000)
    })

    it('delists an instant vehicle ', async () => {
      await contract.delistInstant(0)
      var isForSale = await contract.isForSale(0)
      assert.equal(isForSale, false)
    })

    it('fails to delist a vehicle that is not for sale', async () => {
      try {
        await contract.delistInstant(0)
      } catch (e) {
        assert(e.message.includes("E4"))
      }
    })
  })

  describe('Auctions func.', async () => {
    it('fails to list a vehicle with price zero', async () => {
      try {
        await contract.listAuction(0, 0)
      } catch (e) {
        assert(e.message.includes("E8"))
      }
    })

    it('lists a vehicle as auction', async () => {
      await contract.listAuction(0, 1000)
      var isForSale = await contract.isForSale(0)
      var isAuction = await contract.isAuction(0)
      assert.equal(isForSale, true)
      assert.equal(isAuction, true)
    })

    it('fails to list a vehicle that is already listed', async () => {
      try {
        await contract.listAuction(0, 1000)
      } catch (e) {
        assert(e.message.includes("E5"))
      }
    })

    it('fails to set the price after vehicle is listed', async () => {
      try {
        await contract.setVehiclePrice(0, 1000)
      } catch (e) {
        assert(e.message.includes("E7"))
      }
    })

    it('displays the correct price', async () => {
      var price = await contract.getVehiclePrice(0)
      assert.equal(price, 1000)
    })

    it('delists an auction vehicle ', async () => {
      await contract.delistAuction(0)
      var isForSale = await contract.isForSale(0)
      var isAuction = await contract.isAuction(0)
      assert.equal(isForSale, false)
      assert.equal(isAuction, false)
    })

    it('fails to delist a vehicle that is not for sale', async () => {
      try {
        await contract.delistAuction(0)
      } catch (e) {
        assert(e.message.includes("E4"))
      }
    })

  })


  describe('Buying func.', async () => {

    it('fails when vehicle is not for sale', async () => {
      try {
        await contract.buy(0).from("0xf3Def80911CB8F104090F9ce54310B8e963BB109").amount(20000)
      } catch (e) {
        assert(e.message.includes("E4"))
      }
    })

    it('lists vehicle for sale', async () => {
      await contract.listInstant(0, 20000)
      var isForSale = await contract.isForSale(0)
      assert.equal(isForSale, true)
    })

    it('fails when price is incorrect', async () => {
      try {
        await contract.buy(0).from("0xf3Def80911CB8F104090F9ce54310B8e963BB109").amount(10000)
      } catch (e) {
        assert(e.message.includes("E9"))
      }
    })

    it('successfully completes the transaction', async () => {
      await contract.buy(0).from("0xf3Def80911CB8F104090F9ce54310B8e963BB109").amount(20000)
      var owner = await contract.ownerOf(0)
      assert.equal(owner, "0xf3Def80911CB8F104090F9ce54310B8e963BB109")

    })

  })

  describe('Bidding', async () => {

    it('fails when vehicle is not for sale', async () => {
      try {
        await contract.bid(0).amount(20000)
      } catch (e) {
        assert(e.message.includes("E4"))
      }
    })

    it('lists vehicle as auction', async () => {
      await contract.listAuction(0, 20000)
      var isAuction = await contract.isAuction(0)
      assert.equal(isAuction, true)
    })

    it('fails when bid is lower than top bid', async () => {
      try {
        await contract.bid(0).amount(10000)
      } catch (e) {
        assert(e.message.includes("E10"))
      }
    })

    it('fails when bidding on own vehicle', async () => {
      try {
        await contract.bid(0).amount(20000)
      } catch (e) {
        assert(e.message.includes("E11"))
      }
    })

    it('successfully places a bid', async () => {
      await contract.bid(0).from("0x68d9742B1a49c76E345ba037C08d04502BdbF963").amount(40000)
      var topBidder = await contract.getTopBidder(0)
      assert.equal(topBidder, "0x68d9742B1a49c76E345ba037C08d04502BdbF963")
      var vehiclePrice = await contract.getVehiclePrice(0)
      assert.equal(vehiclePrice, 40000)
    })

    it('successfully concludes an auction', async () => {
      await contract.concludeAuction(0)
      var owner = await contract.ownerOf(0)
      assert.equal(owner, "0x68d9742B1a49c76E345ba037C08d04502BdbF963")
    })

  })


})

contract('Odometer', () => {

  let contract = null

  before(async () => {
    contract = await Odometer.deployed()
  })

  describe('Odometer main func.', async () => {

    it('returns the correct odometer value', async () => {
      var odometer = await contract.getOdometerValue(0)
      assert.equal(odometer,0)
    });

    it('rejects odometer increment by unauthorized', async () => {
      try {
        await contract.increaseOdometer(0,20)
      } catch (e) {
        assert(e.message.includes("Reverted"))
      }
    });

    it('rejects odometer address setting by unauthorized', async () => {
      try {
        await contract.setOdometerAddress(0,"0x68d9742B1a49c76E345ba037C08d04502BdbF963").from("0x68d9742B1a49c76E345ba037C08d04502BdbF963")
      } catch (e) {
        assert(e.message.includes("Reverted"))
      }
    });

    it('allows odomter address to be set by authorized', async () => {

        await contract.setOdometerAddress(0,"0x68d9742B1a49c76E345ba037C08d04502BdbF963")
        var odometerAddress = await contract.getOdometerAddress(0)
        assert.equal(odometerAddress,"0x68d9742B1a49c76E345ba037C08d04502BdbF963")
    });

    it('allows odometer address to increment', async () => {
      await contract.increaseOdometer(0, 20).from("0x68d9742B1a49c76E345ba037C08d04502BdbF963")
      var odometerValue = await contract.getOdometerValue(0)
      assert.equal(odometerValue,20)
  });
    
  })


})

contract('Management', () => {

  let contract = null

  before(async () => {
    contract = await Management.deployed()
  })

  describe('Management main func.', async () => {

    it('allows authorized to set the refresh cache', async () => {
      await contract.setRefreshCache(true)
      var refreshCache = await contract.getRefreshCache()
      assert.equal(refreshCache,true)
    });

    it('rejects unauthorized to set refresh cache', async () => {
      try {
        await contract.setRefreshCache(false).from("0x7820d64BB73a4912126DcBdf06B87ce0a266160b")
      } catch (e) {
        assert(e.message.includes("Revert"))
      }
    });

    it('allows authorized to set restart', async () => {
      await contract.setRestart(true)
      var restart = await contract.getRestart()
      assert.equal(restart,true)
    });

    it('rejects unauthorized to set restart', async () => {
      try {
        await contract.setRestart(false).from("0x7820d64BB73a4912126DcBdf06B87ce0a266160b")
      } catch (e) {
        assert(e.message.includes("Revert"))
      }
    });

    it('allows authorized to set api address', async () => {
      await contract.setApiAddress("https://foo.com")
      var apiAddress = await contract.getApiAddress()
      assert.equal(apiAddress,"https://foo.com")
    });

    it('rejects unauthorized to set api address', async () => {
      try {
        await contract.setApiAddress("https://foo2.com").from("0x7820d64BB73a4912126DcBdf06B87ce0a266160b")
      } catch (e) {
        assert(e.message.includes("Revert"))
      }
    });

    
  })


})
