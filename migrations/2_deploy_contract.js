const BoolBitStorage = artifacts.require("BoolBitStorage");
const RolesAndPermissions = artifacts.require("RolesAndPermissions");
const Vehicle = artifacts.require("Vehicle");
const ExternalGateway = artifacts.require("ExternalGateway");


module.exports = function (deployer) {
 deployer.deploy(BoolBitStorage);
 deployer.link(BoolBitStorage,Vehicle);
 deployer.link(BoolBitStorage,ExternalGateway);
 deployer.deploy(RolesAndPermissions);
 deployer.deploy(Vehicle);
 deployer.deploy(ExternalGateway);
};
