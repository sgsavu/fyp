// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./BoolBitStorage.sol";
import "./RolesAndPermissions.sol";

contract Vehicle is ERC721Enumerable, RolesAndPermissions, BoolBitStorage {
    using Counters for Counters.Counter;
    Counters.Counter _tokenIds;

    event Received(address, uint256);

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    mapping(uint256 => string) internal _tokenURIs;
    mapping(string => bool) private _uriRegistered;
    mapping(uint256 => uint256) private _forSale;
    mapping(uint256 => uint256) private _auction;
    mapping(uint256 => uint256) private _vehiclePrice;
    mapping(uint256 => uint256) private _topBid;
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

    modifier onlyIfNotRegistered(string memory uri) {
        require(_uriRegistered[uri] == false, "Duplicate URI's detected.");
        _;
    }

    modifier onlyOwnerOf(uint256 tokenId) {
        require(
            ownerOf(tokenId) == msg.sender,
            "Message sender is not the owner/authorized for the tokenId provided."
        );
        _;
    }

    modifier onlyIfExists(uint256 tokenId) {
        require(_exists(tokenId), "Token/Vehicle does not exist.");
        _;
    }

    modifier onlyIfAuction(uint256 tokenId) {
        require(_isAuction(tokenId), "Vehicle is not an auction.");
        _;
    }

    modifier onlyIfForSale(uint256 tokenId) {
        require(_isForSale(tokenId), "Vehicle is not for sale.");
        _;
    }

    modifier onlyIfNotForSale(uint256 tokenId) {
        require(!_isForSale(tokenId), "Vehicle is already for sale.");
        _;
    }

    modifier onlyIfNotAuction(uint256 tokenId) {
        require(!_isAuction(tokenId), "Vehicle is already an auction.");
        _;
    }

    modifier onlyIfNotTopBidder(uint256 tokenId) {
        require(
            _getTopBidder(tokenId) != msg.sender,
            "Cannot withdraw bid while being top bidder."
        );
        _;
    }

    modifier onlyIfPriceNonNull(uint256 price) {
        require(price > 0, "Cannot set price to 0.");
        _;
    }

    // MONEY TRANSFERING AND BALANCE

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function _secureMoneyTransfer(address beneficiary, uint256 money) internal {
        address payable _beneficiary = payable(beneficiary);
        (bool sent, bytes memory data) = _beneficiary.call{value: money}("");
        require(sent, "Failed to send money to beneficiary");
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
            "Failed to transfer vehicle to buyer"
        );
    }

    // AUCTIONING

    function _refundCurentTopBidder(uint256 tokenId) internal {
        address currentTopBidder = _getTopBidder(tokenId);
        uint256 currentTopBid = _getTopBid(tokenId);
        if (currentTopBid != 0 && currentTopBidder != address(0))
            _secureMoneyTransfer(currentTopBidder, currentTopBid);
    }

    function _resetAuction(uint256 tokenId) internal {
        if (_getTopBidder(tokenId) != address(0))
                _setTopBidder(tokenId, address(0));
            if (_getTopBid(tokenId) != 0)
                _setTopBid(tokenId, 0);
    }

    function _concludeAuction(uint256 tokenId) internal {
        address topBidder = _getTopBidder(tokenId);
        require(topBidder != address(0));
        uint256 topBid = _getTopBid(tokenId);
        _classicExchange(msg.sender, topBidder, tokenId, topBid);
        _resetAuction(tokenId);
        _removeFromSale(tokenId);
    }

    function _setTopBid(uint256 tokenId, uint256 amount) internal {
        _topBid[tokenId] = amount;
    }

    function _getTopBid(uint256 tokenId) internal view returns (uint256) {
        return _topBid[tokenId];
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
        (multiplier, bit) = _tokenIdToBoolBit(tokenId);
        return _getBoolean(_forSale[multiplier], bit);
    }

    function _isAuction(uint256 tokenId) internal view returns (bool) {
        uint256 multiplier;
        uint256 bit;
        (multiplier, bit) = _tokenIdToBoolBit(tokenId);
        return _getBoolean(_auction[multiplier], bit);
    }

    function _setIsForSale(uint256 tokenId, bool value) internal {
        uint256 multiplier;
        uint256 bit;
        (multiplier, bit) = _tokenIdToBoolBit(tokenId);
        _forSale[multiplier] = _setBoolean(_forSale[multiplier], bit, value);
    }

    function _setIsAuction(uint256 tokenId, bool value) internal {
        uint256 multiplier;
        uint256 bit;
        (multiplier, bit) = _tokenIdToBoolBit(tokenId);
        _auction[multiplier] = _setBoolean(_auction[multiplier], bit, value);
    }

    //URI

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal {
        _tokenURIs[tokenId] = _tokenURI;
    }

    //MINT

    function getTokenIdsCurrent() internal view returns (uint256) {
        return _tokenIds.current();
    }

    function mint(string memory uri) internal {
        uint256 _tokenId = _tokenIds.current();
        _mint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, uri);
        _uriRegistered[uri] = true;
        _tokenIds.increment();
    }

    function burn(uint256 _tokenId) internal {
        _burn(_tokenId);
        _setTokenURI(_tokenId, "Vehicle Deleted");
    }
}
