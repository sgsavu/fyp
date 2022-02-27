// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./Roles.sol";

contract Vehicle is ERC721Enumerable {

    using Counters for Counters.Counter;
    Counters.Counter _tokenIds;
    Roles roles = Roles(0x8ba57a208228fABD36C7d51184f16a7DbF01e9da);

    mapping(uint256 => string) internal _tokenURIs;
    mapping(string => bool) private _uriRegistered;

    constructor() ERC721("Vehicle", "VHC") {}
    /*
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    */

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

    function setTokenURI(uint256 tokenId, string memory _tokenURI) external {
        require (roles.hasRole(roles.GARAGE_ROLE(), msg.sender));
        _setTokenURI(tokenId, _tokenURI);
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
