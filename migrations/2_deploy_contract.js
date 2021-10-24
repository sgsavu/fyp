const Vehicle = artifacts.require("Vehicle");

module.exports = function (deployer) {
  deployer.deploy(Vehicle);
};
