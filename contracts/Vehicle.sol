// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Vehicle is ERC721Enumerable {

    using Counters for Counters.Counter;
    Counters.Counter _tokenIds;

    uint256[] private _allTokens;
    mapping(address => mapping(uint256 => uint256)) private _ownedTokens;
    mapping(uint256 => string) _tokenURIs;


    struct VehicleToken {
        uint256 id;
        string uri;
    }

    constructor() ERC721("Vehicle", "VHC") {}

    /*
    modifier notRegistered(uint256 tokenId) {
        require(_tokenURIs[tokenId]== );
        _;
    }
    */

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal {
        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(_exists(tokenId));
        return _tokenURIs[tokenId];
    }

    function mint(string memory uri) public returns (uint256){

        uint256 _id = _tokenIds.current();
        _mint(msg.sender, _id);
        _setTokenURI(_id, uri);
        _tokenIds.increment();
        return _id;
    }

}
