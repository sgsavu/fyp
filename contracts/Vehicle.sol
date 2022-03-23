// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./Roles.sol";

/// @title The Vehicle NFT contract
/// @notice This contract represents the non fungible tokens that are the vehicles we are trying
///         to represent. We can mint or burn vehicles and get their information.
contract Vehicle is ERC721Enumerable {

    using Counters for Counters.Counter;
    Counters.Counter _tokenIds;

    Roles roles;

    event NewGarageApproval(uint256 indexed tokenId);

    mapping(uint256 => string) internal _tokenURIs;
    mapping(string => bool) private _uriRegistered;
    mapping(uint256 => address) private _approvedGarage;

    /// @dev We are inheriting the roles and permissions from our
    ///      Roles contract deployed before this one. 
    constructor(address addr) ERC721("Vehicle", "VHC") {
        roles = Roles(addr);
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

    /// @dev Getter that checks if the tokenId exists in the pool of vehicles.
    function exists(uint256 tokenId) external view returns (bool) {
        return _exists(tokenId);
    }

    /// @dev Getter that returns the approved garage/modifier for the tokenId provided.
    function getApprovedGarage (uint256 tokenId) public view returns (address) {
        return _approvedGarage[tokenId];
    }

    /// @dev Setter that enables owners to approve another address as a garage/modifier.
    function setApprovedGarage (uint256 tokenId, address addr) external {
        require(msg.sender == ownerOf(tokenId));
        _approvedGarage[tokenId] = addr;
        emit NewGarageApproval(tokenId);
    }

    ///@dev The permission is revoked upon success
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

    ///@dev Only minters are allowed to create vehicles
    ///     No duplicate uris allowed.
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

    ///@dev Only the authority class is allowed to destroy vehicles
    function burn(uint256 _tokenId) external {
        require(
            roles.isAuthorityClass(msg.sender)
        );
        _burn(_tokenId);
        _setTokenURI(_tokenId, "N/A");
    }
}
