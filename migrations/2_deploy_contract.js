const BoolBitStorage = artifacts.require("BoolBitStorage");
const Roles = artifacts.require("Roles");
const Vehicle = artifacts.require("Vehicle");
const Gateway = artifacts.require("Gateway");
const Management = artifacts.require("Management");
const Odometer = artifacts.require("Odometer");
const Marketplace = artifacts.require("Marketplace");

module.exports = async function (deployer) {
    await deployer.deploy(BoolBitStorage);
    await deployer.link(BoolBitStorage, Gateway);
    await deployer.deploy(Roles)
    await deployer.deploy(Odometer, Roles.address);
    await deployer.deploy(Management, Roles.address);
    await deployer.deploy(Vehicle, Roles.address)
    await deployer.deploy(Gateway, Vehicle.address);
};
