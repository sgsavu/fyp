const Vehicle = artifacts.require("Vehicle");
const RolesAndPermissions = artifacts.require("RolesAndPermissions");
const BoolBitStorage = artifacts.require("BoolBitStorage");
const ExternalGateway = artifacts.require("ExternalGateway");

module.exports = function (deployer) {
  deployer.deploy(Vehicle);
  deployer.deploy(RolesAndPermissions);
  deployer.deploy(BoolBitStorage);
  deployer.deploy(ExternalGateway);
};
