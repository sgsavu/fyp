// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./Roles.sol";

/*
This contract represents the non fungible tokens that are the vehicles we are trying
to represent. We can mint or burn vehicles and get their information.
*/
contract Vehicle is ERC721Enumerable {

    using Counters for Counters.Counter;
    Counters.Counter _tokenIds;

    Roles roles;

    struct getObject {
        uint[] ids;
        string[] uris;
        address[] owners;
        address[] garages;
    }

    event NewGarageApproval(uint256 indexed tokenId);

    mapping(uint256 => string) internal _tokenURIs;
    mapping(string => bool) private _uriRegistered;
    mapping(uint256 => address) private _approvedGarage;

    constructor(address addr) ERC721("Vehicle", "VHC") {
        roles = Roles(addr);
    }

    function getAllVehicles () 
    public
    view
    returns (getObject memory)
    {   

        getObject memory getObject1;


        uint256 totalSupply = totalSupply();
        uint256[] memory ids = new uint256[](totalSupply);
        string[] memory uris = new string[](totalSupply);
        address[] memory owners = new address[](totalSupply);
        address[] memory garages = new address[](totalSupply);
        
        for (uint256 i=0 ; i< totalSupply; i++) {
            uint256 index = tokenByIndex(i);

            ids[i] = index;
            uris[i] = tokenURI(index);
            owners[i] = ownerOf(index);
            garages[i] = _approvedGarage[index];
        }

        getObject1.ids = ids;
        getObject1.uris = uris;
        getObject1.owners = owners;
        getObject1.garages = garages;

        return getObject1;
    }


    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        return _tokenURIs[tokenId];
    }

    function exists(uint256 tokenId) external view returns (bool) {
        return _exists(tokenId);
    }

    function getApprovedGarage (uint256 tokenId) public view returns (address) {
        return _approvedGarage[tokenId];
    }

    function setApprovedGarage (uint256 tokenId, address addr) external {
        require(msg.sender == ownerOf(tokenId));
        _approvedGarage[tokenId] = addr;
        emit NewGarageApproval(tokenId);
    }

    function setTokenURI(uint256 tokenId, string memory _tokenURI) external {
        require (getApprovedGarage(tokenId) == msg.sender);
        require (roles.hasRole(roles.GARAGE_ROLE(), msg.sender));
        _setTokenURI(tokenId, _tokenURI);
        _approvedGarage[tokenId] = 0x0000000000000000000000000000000000000000;
        emit NewGarageApproval(tokenId);
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal {
        _tokenURIs[tokenId] = _tokenURI;
    }

    function mint(string memory uri) external {
        require(
            roles.isMinterClass(msg.sender)
        );
        require(_uriRegistered[uri] == false, "E3");
        uint256 _tokenId = _tokenIds.current();
        _mint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, uri);
        _uriRegistered[uri] = true;
        _tokenIds.increment();
    }

    function burn(uint256 _tokenId) external {
        require(
            roles.isAuthorityClass(msg.sender)
        );
        _burn(_tokenId);
        _setTokenURI(_tokenId, "N/A");
    }
}
