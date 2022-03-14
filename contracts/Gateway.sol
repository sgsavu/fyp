// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "./Marketplace.sol";
import "./Vehicle.sol";

contract Gateway is Marketplace {
    event NewPrice(uint256 indexed tokenId);
    event NewTopBidder(uint256 indexed tokenId);
    event SaleStatus(uint256 indexed tokenId, bool status);
    uint256 tax = 100000000000000 wei;
    Vehicle vhc;
    
    receive() external payable {}

    constructor (address addr) {
        vhc = Vehicle(addr);
    }

    function balanceOfSC () public view returns (uint256) {
        return address(this).balance;
    }

    //MODIFIERS

    modifier onlyIfExists(uint256 tokenId) {
        require(vhc.exists(tokenId));
        _;
    }

    modifier onlyOwnerOf(uint256 tokenId) {
        require(vhc.ownerOf(tokenId) == msg.sender, "E2");
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
        require(price > 1000000000000000, "E8");
        _;
    }

    // GETTERS

    function getVehiclePrice(uint256 tokenId)
        external
        view
        onlyIfExists(tokenId)
        onlyIfForSale(tokenId)
        returns (uint256)
    {
        return _getVehiclePrice(tokenId);
    }

    function getTopBidder(uint256 tokenId)
        external
        view
        onlyIfExists(tokenId)
        onlyIfForSale(tokenId)
        onlyIfAuction(tokenId)
        returns (address)
    {
        return _getTopBidder(tokenId);
    }

    function isAuction(uint256 tokenId)
        external
        view
        onlyIfExists(tokenId)
        returns (bool)
    {
        return _isAuction(tokenId);
    }

    function isForSale(uint256 tokenId)
        external
        view
        onlyIfExists(tokenId)
        returns (bool)
    {
        return _isForSale(tokenId);
    }

    // LISTING/DELISTING

    function listAuction(uint256 tokenId, uint256 price)
        external
        onlyIfExists(tokenId)
        onlyOwnerOf(tokenId)
        onlyIfNotForSale(tokenId)
        onlyIfNotAuction(tokenId)
        onlyIfPriceNonNull(price)
    {
        _listAuction(tokenId, price);
        emit SaleStatus(tokenId, true);
    }

    function listInstant(uint256 tokenId, uint256 price)
        external
        onlyIfExists(tokenId)
        onlyOwnerOf(tokenId)
        onlyIfNotForSale(tokenId)
        onlyIfPriceNonNull(price)
    {
        _listInstant(tokenId, price);
        emit SaleStatus(tokenId, true);
    }

    function delistAuction(uint256 tokenId)
        external
        onlyIfExists(tokenId)
        onlyOwnerOf(tokenId)
        onlyIfAuction(tokenId)
    {
        _refundCurentTopBidder(tokenId);
        _delistAuction(tokenId);
        emit SaleStatus(tokenId, false);
    }

    function delistInstant(uint256 tokenId)
        external
        onlyIfExists(tokenId)
        onlyOwnerOf(tokenId)
        onlyIfForSale(tokenId)
        onlyIfNotAuction(tokenId)
    {
        _delistInstant(tokenId);
        emit SaleStatus(tokenId, false);
    }

    // SETTERS

    function setVehiclePrice(uint256 tokenId, uint256 _price)
        external
        onlyIfExists(tokenId)
        onlyOwnerOf(tokenId)
        onlyIfForSale(tokenId)
        onlyIfNotAuction(tokenId)
        onlyIfPriceNonNull(_price)
    {
        _setVehiclePrice(tokenId, _price);
        emit NewPrice(tokenId);
    }

    //// MONEY TX

    function buy(uint256 tokenId)
        external
        payable
        onlyIfExists(tokenId)
        onlyIfForSale(tokenId)
        onlyIfNotAuction(tokenId)
    {
        require(msg.value == _getVehiclePrice(tokenId), "E9");

        _secureMoneyTransfer(vhc.ownerOf(tokenId), msg.value - tax);

        vhc.transferFrom(vhc.ownerOf(tokenId), msg.sender, tokenId);
        require(vhc.ownerOf(tokenId) == msg.sender, "E13");
        _delistInstant(tokenId);

        emit SaleStatus(tokenId, false);
    }

    function bid(uint256 tokenId)
        external
        payable
        onlyIfExists(tokenId)
        onlyIfAuction(tokenId)
    {
        require(msg.value > _getVehiclePrice(tokenId), "E10");
        require(msg.sender != vhc.ownerOf(tokenId), "E11");

        _refundCurentTopBidder(tokenId);
        _secureMoneyTransfer(address(this), msg.value);

        _setVehiclePrice(tokenId, msg.value);
        _setTopBidder(tokenId, msg.sender);

        emit NewPrice(tokenId);
        emit NewTopBidder(tokenId);
    }

    function concludeAuction(uint256 tokenId)
        external
        onlyIfExists(tokenId)
        onlyOwnerOf(tokenId)
        onlyIfAuction(tokenId)
    {
        address topBidder = _getTopBidder(tokenId);
        require(topBidder != address(0));

        _secureMoneyTransfer(vhc.ownerOf(tokenId), _getVehiclePrice(tokenId) - tax);

        vhc.transferFrom(vhc.ownerOf(tokenId), topBidder, tokenId);
        require(vhc.ownerOf(tokenId) == topBidder, "E13");

        _setIsAuction(tokenId, false);
        _setTopBidder(tokenId, address(0));
        _delistInstant(tokenId);

        emit SaleStatus(tokenId, false);
    }

    // MONEY HANDLING

    function _secureMoneyTransfer(address beneficiary, uint256 money) internal {
        (bool sent, bytes memory data) = payable(beneficiary).call{
            value: money
        }("");
        require(sent, "E12");
    }

    function _refundCurentTopBidder(uint256 tokenId) internal {
        address currentTopBidder = _getTopBidder(tokenId);
        uint256 currentTopBid = _getVehiclePrice(tokenId);
        if (currentTopBid != 0 && currentTopBidder != address(0))
            _secureMoneyTransfer(currentTopBidder, currentTopBid);
    }
}
