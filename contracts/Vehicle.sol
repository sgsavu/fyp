// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

contract Vehicle is ERC721 {

    string[] private vehicles;

    mapping (uint => string) _vehiclePlate;
    mapping(string => bool) _vehicleExists;

    mapping(uint => address) _vehicleToOwner;
    mapping(address => uint)_ownerVehicleCount;

    constructor() ERC721("Vehicle", "VHC"){
    }

    function totalSupply() external view returns (uint256){
        return vehicles.length;
    }

    modifier notRegistered(string memory _vehicle) {
        require(!_vehicleExists[_vehicle]);
        _;
    }

    function mint(string memory _vehicle) public notRegistered(_vehicle){

        vehicles.push(_vehicle);
        uint _id = vehicles.length;
        _vehiclePlate[_id] = _vehicle;

        _mint(msg.sender, _id);
        _vehicleToOwner[_id] = msg.sender;
        _ownerVehicleCount[msg.sender] = _ownerVehicleCount[msg.sender] + 1;
        _vehicleExists[_vehicle] = true;
    }

    function getVehiclePlateForTokenId(uint _tokenId) public view returns (string memory){
        return _vehiclePlate[_tokenId];
    }


}