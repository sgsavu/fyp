// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./BoolBitStorage.sol";
import "./RolesAndPermissions.sol";

import "@openzeppelin/contracts/utils/Counters.sol";


contract Vehicle is ERC721Enumerable, RolesAndPermissions {
    
    using Counters for Counters.Counter;
    Counters.Counter _tokenIds;
    event SaleStatus(uint256 indexed tokenId, bool status, bool isAuction);

    receive() external payable {}

    mapping(uint256 => address) internal _odometerAddress;
    mapping(uint256 => uint256) internal _odometerValue;

    mapping(uint256 => string) internal _tokenURIs;

    mapping(string => bool) private _uriRegistered;

    mapping(uint256 => uint256) private _forSale;
    mapping(uint256 => uint256) private _auction;
    mapping(uint256 => uint256) private _vehiclePrice;
    mapping(uint256 => address) private _topBidder;

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    constructor() ERC721("Vehicle", "VHC") {}


    // MODIFIERS

    modifier onlyOwnerOf(uint256 tokenId) {
        require(ownerOf(tokenId) == msg.sender, "E2");
        _;
    }

    modifier onlyIfForSale(uint256 tokenId) {
        require(_isForSale(tokenId), "E4");
        _;
    }

    modifier onlyIfNotForSale(uint256 tokenId) {
        require(!_isForSale(tokenId), "E5");
        _;
    }

    modifier onlyIfAuction(uint256 tokenId) {
        require(_isAuction(tokenId), "E6");
        _;
    }

    modifier onlyIfNotAuction(uint256 tokenId) {
        require(!_isAuction(tokenId), "E7");
        _;
    }

    modifier onlyIfPriceNonNull(uint256 price) {
        require(price > 0, "E8");
        _;
    }

    // MONEY TRANSFERING

    function _secureMoneyTransfer(address beneficiary, uint256 money) internal {
        (bool sent, bytes memory data) = payable(beneficiary).call{value: money}("");
        require(sent, "E12");
    }

    function _classicExchange(
        address seller,
        address buyer,
        uint256 vehicle,
        uint256 money
    ) internal {
        _secureMoneyTransfer(seller, money);
        _transfer(seller, buyer, vehicle);
        require(
            ownerOf(vehicle) == buyer,
            "E13"
        );
    }

    // AUCTIONING

    function _refundCurentTopBidder(uint256 tokenId) internal {
        address currentTopBidder = _getTopBidder(tokenId);
        uint256 currentTopBid = _getVehiclePrice(tokenId);
        if (currentTopBid != 0 && currentTopBidder != address(0))
            _secureMoneyTransfer(currentTopBidder, currentTopBid);
    }

    function _resetAuction(uint256 tokenId) internal {
        if (_getTopBidder(tokenId) != address(0))
            _setTopBidder(tokenId, address(0));
        if (_getVehiclePrice(tokenId) != 0) _setVehiclePrice(tokenId, 0);
    }

    function _concludeAuction(uint256 tokenId) internal {
        address topBidder = _getTopBidder(tokenId);
        require(topBidder != address(0));
        _classicExchange(
            msg.sender,
            topBidder,
            tokenId,
            _getVehiclePrice(tokenId)
        );
        _resetAuction(tokenId);
        _removeFromSale(tokenId);
    }

    function _getTopBidder(uint256 tokenId) internal view returns (address) {
        return _topBidder[tokenId];
    }

    function _setTopBidder(uint256 tokenId, address _account) internal {
        _topBidder[tokenId] = _account;
    }

    function _listAuction(uint256 tokenId, uint256 price) internal {
        _listForSale(tokenId, price);
        _setIsAuction(tokenId, true);
    }

    // BUYING SELLING

    function _getVehiclePrice(uint256 tokenId) internal view returns (uint256) {
        return _vehiclePrice[tokenId];
    }

    function _setVehiclePrice(uint256 tokenId, uint256 _price) internal {
        _vehiclePrice[tokenId] = _price;
    }

    function _listForSale(uint256 tokenId, uint256 price) internal {
        _setIsForSale(tokenId, true);
        _setVehiclePrice(tokenId, price);
    }

    function _removeFromSale(uint256 tokenId) internal {
        if (_isAuction(tokenId)) {
            _refundCurentTopBidder(tokenId);
            _resetAuction(tokenId);
            _setIsAuction(tokenId, false);
        }
        _setIsForSale(tokenId, false);
    }

    //BOOL BIT STORAGE

    function _isForSale(uint256 tokenId) internal view returns (bool) {
        uint256 multiplier;
        uint256 bit;
        (multiplier, bit) = BoolBitStorage._tokenIdToBoolBit(tokenId);
        return BoolBitStorage._getBoolean(_forSale[multiplier], bit);
    }

    function _isAuction(uint256 tokenId) internal view returns (bool) {
        uint256 multiplier;
        uint256 bit;
        (multiplier, bit) = BoolBitStorage._tokenIdToBoolBit(tokenId);
        return BoolBitStorage._getBoolean(_auction[multiplier], bit);
    }

    function _setIsForSale(uint256 tokenId, bool value) internal {
        uint256 multiplier;
        uint256 bit;
        (multiplier, bit) = BoolBitStorage._tokenIdToBoolBit(tokenId);
        _forSale[multiplier] = BoolBitStorage._setBoolean(
            _forSale[multiplier],
            bit,
            value
        );
    }

    function _setIsAuction(uint256 tokenId, bool value) internal {
        uint256 multiplier;
        uint256 bit;
        (multiplier, bit) = BoolBitStorage._tokenIdToBoolBit(tokenId);
        _auction[multiplier] = BoolBitStorage._setBoolean(
            _auction[multiplier],
            bit,
            value
        );
    }

    //URI

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal {
        _tokenURIs[tokenId] = _tokenURI;
    }

    // MINT/BURN

    function mint(string memory uri)
        internal
    {
        require(_uriRegistered[uri] == false, "E3");
        uint256 _tokenId = _tokenIds.current();
        _mint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, uri);
        _uriRegistered[uri] = true;
        _tokenIds.increment();
    }


    function burn(uint256 _tokenId)
        internal
    {
        _removeFromSale(_tokenId);
        emit SaleStatus(_tokenId, false, false);
        _burn(_tokenId);
        _setTokenURI(_tokenId, "N/A");
    }
}
