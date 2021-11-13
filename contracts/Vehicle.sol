// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Vehicle is ERC721Enumerable, Ownable, AccessControl {

    using Counters for Counters.Counter;
    Counters.Counter _tokenIds;

    bytes32 private constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 private constant MINTER_ROLE_ADMIN = keccak256("MINTER_ROLE_ADMIN");
    bytes32 private constant AUTHORITY_ROLE = keccak256("AUTHORITY_ROLE");
    bytes32 private constant AUTHORITY_ROLE_ADMIN = keccak256("AUTHORITY_ROLE_ADMIN");

    mapping(uint256 => string) private _tokenURIs;
    mapping(string => bool) private _uriRegistered;
    mapping(uint256 => bool) private _forSale;

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    constructor() ERC721("Vehicle", "VHC") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE_ADMIN, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        
        _setRoleAdmin(MINTER_ROLE_ADMIN,DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(AUTHORITY_ROLE_ADMIN,DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(MINTER_ROLE,MINTER_ROLE_ADMIN);
        _setRoleAdmin(AUTHORITY_ROLE,AUTHORITY_ROLE_ADMIN);
    }

    modifier notAlreadyRegistered(string memory uri) {
        require(_uriRegistered[uri] == false);
        _;
    }

    modifier onlyOwnerOf(uint256 tokenId){
        require(ownerOf(tokenId)==msg.sender);
        _;
    }


    function getTokensForSale() public view returns (uint256[] memory){

        uint256 lastToken = _tokenIds.current();
        uint256 counter = 0;
        uint256[] memory tokensForSale = new uint256[](lastToken);

        for (uint i = 0; i < lastToken;i++)
        {
            if (_exists(i))
            {
                if (_forSale[i]==true)
                {
                    tokensForSale[counter] = i;
                    counter = counter + 1;
                }
            }   
        }
        
        return tokensForSale;
    }

    

    function listForSale(uint256 tokenId) public onlyOwnerOf(tokenId){
        _forSale[tokenId] = true;
    }

    function isForSale(uint256 tokenId) public view returns (bool){
        return _forSale[tokenId];
    }

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

    enum ROLE_CLASS{ MINTER, AUTHORITY, ADMIN }

    modifier onlyClass(ROLE_CLASS class){

        if (class == ROLE_CLASS.MINTER){
            require (hasRole(MINTER_ROLE,msg.sender) || hasRole(MINTER_ROLE_ADMIN,msg.sender));
        }
        else if (class == ROLE_CLASS.AUTHORITY){
            require (hasRole(AUTHORITY_ROLE,msg.sender) || hasRole(AUTHORITY_ROLE_ADMIN,msg.sender));
        }
        else if (class == ROLE_CLASS.ADMIN){
            require (hasRole(MINTER_ROLE_ADMIN,msg.sender) || hasRole(AUTHORITY_ROLE_ADMIN,msg.sender) || hasRole(DEFAULT_ADMIN_ROLE,msg.sender));
        }
        _;
    }

    function mint(string memory uri) public onlyClass(ROLE_CLASS.MINTER) notAlreadyRegistered(uri) returns (uint256) {
        uint256 _id = _tokenIds.current();
        _mint(msg.sender, _id);
        _setTokenURI(_id, uri);
        _uriRegistered[uri] = true;
        _forSale[_id] = true;
        _tokenIds.increment();
        return _id;
    }
}
