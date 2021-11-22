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

    enum ROLE_CLASS {
        MINTER,
        AUTHORITY,
        ADMIN
    }

    event Received(address, uint256);

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    bytes32 private constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 private constant MINTER_ROLE_ADMIN = keccak256("MINTER_ROLE_ADMIN");
    bytes32 private constant AUTHORITY_ROLE = keccak256("AUTHORITY_ROLE");
    bytes32 private constant AUTHORITY_ROLE_ADMIN =
        keccak256("AUTHORITY_ROLE_ADMIN");

    mapping(uint256 => string) private _tokenURIs;
    mapping(string => bool) private _uriRegistered;
    mapping(uint256 => uint256) private _isForSale;
    mapping(uint256 => uint256) private _isAuction;
    mapping(uint256 => uint256) private _vehicleToPrice;
    mapping(uint256 => mapping (address => uint256)) private _collectedPayments;
    mapping(uint256 => address) private _topBidder;

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

        _setRoleAdmin(MINTER_ROLE_ADMIN, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(AUTHORITY_ROLE_ADMIN, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(MINTER_ROLE, MINTER_ROLE_ADMIN);
        _setRoleAdmin(AUTHORITY_ROLE, AUTHORITY_ROLE_ADMIN);
    }

    modifier notAlreadyRegistered(string memory uri) {
        require(_uriRegistered[uri] == false);
        _;
    }

    modifier onlyOwnerOf(uint256 tokenId) {
        require(ownerOf(tokenId) == msg.sender);
        _;
    }

    /*
    function getTokensForSale() public view returns (uint256[] memory) {
        uint256 lastToken = _tokenIds.current();
        uint256 counter = 0;
        uint256[] memory tokensForSale = new uint256[](lastToken);

        for (uint256 i = 0; i < lastToken; i++) {
            if (_exists(i)) {
                if (isForSale(i)) {
                    tokensForSale[counter] = i;
                    counter = counter + 1;
                }
            }
        }

        return tokensForSale;
    }
    */

    function getTopBidder(uint256 tokenId) public returns (address) {
        return _topBidder[tokenId];
    }


    function auctionEnd(uint256 tokenId) public onlyOwnerOf(tokenId) {
        address topBidder = _topBidder[tokenId];
        require (topBidder!=address(0));
        _transfer(msg.sender, payable(topBidder), tokenId);
        payable(msg.sender).transfer(_collectedPayments[tokenId][topBidder]);
        _setIsForSale(tokenId, false);
        _collectedPayments[tokenId][topBidder] = 0;   
        _topBidder[tokenId] = address(0);
    }

    function bidVehicle(uint256 tokenId) public payable {
        require (msg.value>getVehiclePrice(tokenId));
        if (_collectedPayments[tokenId][msg.sender]!=0)
            payable(msg.sender).transfer(_collectedPayments[tokenId][msg.sender]);
        (bool sent, bytes memory data) = address(this).call{value: msg.value}(
            ""
        );
        _collectedPayments[tokenId][msg.sender] = msg.value;
        _vehicleToPrice[tokenId] = msg.value;
        _topBidder[tokenId] = msg.sender;
        require(sent, "Failed to send Ether");
    }

    function getBidForAccount(uint256 tokenId,address _account) public view returns (uint256){
        return _collectedPayments[tokenId][_account];
    }

    function payForVehicle(uint256 tokenId) public payable {
        require(isForSale(tokenId));
        require(!isAuction(tokenId));
        require(msg.value == _vehicleToPrice[tokenId]);
        address payable _to = payable(ownerOf(tokenId));

        (bool sent, bytes memory data) = _to.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
        _transfer(_to, msg.sender, tokenId);
        _setIsForSale(tokenId, false);
    }

    function getConBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function withdrawBid(uint256 tokenId) public {
        require (getTopBidder(tokenId)!=msg.sender);
        uint256 bid = _collectedPayments[tokenId][msg.sender];
        require (bid>0);
        _collectedPayments[tokenId][msg.sender] = 0;
        payable(msg.sender).transfer(bid);
    }

    function setVehiclePrice(uint256 tokenId, uint256 _price)
        public
        onlyOwnerOf(tokenId)
    {
        require (!isAuction(tokenId));
        _vehicleToPrice[tokenId] = _price;
    }

    function getVehiclePrice(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId));
        return _vehicleToPrice[tokenId];
    }

    function _getBoolean(uint256 _packedBools, uint256 _boolNumber)
        internal
        pure
        returns (bool)
    {
        uint256 flag = (_packedBools >> _boolNumber) & uint256(1);
        return (flag == 1 ? true : false);
    }

    function _setBoolean(
        uint256 _packedBools,
        uint256 _boolNumber,
        bool _value
    ) internal pure returns (uint256) {
        if (_value) return _packedBools | (uint256(1) << _boolNumber);
        else return _packedBools & ~(uint256(1) << _boolNumber);
    }

    function _setIsForSale(uint256 tokenId, bool value) internal {
        require(_exists(tokenId));
        uint256 multiplier = tokenId / 256;
        _isForSale[multiplier] = _setBoolean(
            _isForSale[multiplier],
            tokenId - (256 * multiplier),
            value
        );
    }

    function _setIsAuction(uint256 tokenId, bool value) internal {
        require(_exists(tokenId));
        uint256 multiplier = tokenId / 256;
        _isAuction[multiplier] = _setBoolean(
            _isAuction[multiplier],
            tokenId - (256 * multiplier),
            value
        );
    }

    function listAuction(uint256 tokenId, uint256 price) public onlyOwnerOf(tokenId) {
        require(!isAuction(tokenId));
        listForSale(tokenId, price);
        _setIsAuction(tokenId,true);
    }

    function delistAuction(uint256 tokenId) public onlyOwnerOf(tokenId) {
        require(isAuction(tokenId));
        if (_topBidder[tokenId] != address(0))
            _topBidder[tokenId] = address(0);
        removeFromSale(tokenId);
        _setIsAuction(tokenId,false);
    }

    function listForSale(uint256 tokenId, uint256 price) public onlyOwnerOf(tokenId) {
        require(!isForSale(tokenId));
        _setIsForSale(tokenId, true);
        setVehiclePrice(tokenId, price);
    }

    function removeFromSale(uint256 tokenId) public onlyOwnerOf(tokenId) {
        require(isForSale(tokenId));
        _setIsForSale(tokenId, false);
    }

    function isForSale(uint256 tokenId) public view returns (bool) {
        require(_exists(tokenId));
        uint256 multiplier = tokenId / 256;
        return _getBoolean(_isForSale[multiplier], tokenId - (256 * multiplier));
    }

    function isAuction(uint256 tokenId) public view returns (bool) {
        require(_exists(tokenId));
        uint256 multiplier = tokenId / 256;
        return _getBoolean(_isAuction[multiplier], tokenId - (256 * multiplier));
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

    modifier onlyClass(ROLE_CLASS class) {
        if (class == ROLE_CLASS.MINTER) {
            require(
                hasRole(MINTER_ROLE, msg.sender) ||
                    hasRole(MINTER_ROLE_ADMIN, msg.sender)
            );
        } else if (class == ROLE_CLASS.AUTHORITY) {
            require(
                hasRole(AUTHORITY_ROLE, msg.sender) ||
                    hasRole(AUTHORITY_ROLE_ADMIN, msg.sender)
            );
        } else if (class == ROLE_CLASS.ADMIN) {
            require(
                hasRole(MINTER_ROLE_ADMIN, msg.sender) ||
                    hasRole(AUTHORITY_ROLE_ADMIN, msg.sender) ||
                    hasRole(DEFAULT_ADMIN_ROLE, msg.sender)
            );
        }
        _;
    }

    function mint(string memory uri)
        public
        onlyClass(ROLE_CLASS.MINTER)
        notAlreadyRegistered(uri)
        returns (uint256)
    {
        uint256 _id = _tokenIds.current();
        _mint(msg.sender, _id);
        _setTokenURI(_id, uri);
        _uriRegistered[uri] = true;
        _tokenIds.increment();
        return _id;
    }
}
