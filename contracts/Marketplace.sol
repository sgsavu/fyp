// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "./BoolBitStorage.sol";

/*
The marketplace. This contract includes the functionality to list, delist
vehiles as instant or auction, to set prices, and top bidders.
*/
contract Marketplace {

    mapping(uint256 => uint256) private _forSale;
    mapping(uint256 => uint256) private _auction;
    mapping(uint256 => uint256) private _vehiclePrice;
    mapping(uint256 => address) private _topBidder;
    
    // LISTING/DELISTING

    function _listAuction(uint256 tokenId, uint256 price) internal  {
        _listInstant(tokenId, price);
        _setIsAuction(tokenId, true);
    }

    function _listInstant(uint256 tokenId, uint256 price) internal  {
        _setIsForSale(tokenId, true);
        _setVehiclePrice(tokenId, price);
    }

    function _delistAuction (uint256 tokenId) internal {
        _setIsAuction(tokenId, false);
        if (_getTopBidder(tokenId) != address(0))
                _setTopBidder(tokenId, address(0));
        _delistInstant(tokenId);

    }

    function _delistInstant (uint256 tokenId) internal  {
        _setIsForSale(tokenId, false);
        if (_getVehiclePrice(tokenId) != 0) _setVehiclePrice(tokenId, 0);
    }

    // TOP BIDDER

    function _getTopBidder(uint256 tokenId) internal  view returns (address) {
        return _topBidder[tokenId];
    }

    function _setTopBidder(uint256 tokenId, address _account) internal  {
        _topBidder[tokenId] = _account;
    }

    // VEHICLE PRICE

    function _getVehiclePrice(uint256 tokenId) internal  view returns (uint256) {
        return _vehiclePrice[tokenId];
    }

    function _setVehiclePrice(uint256 tokenId, uint256 _price) internal  {
        _vehiclePrice[tokenId] = _price;
    }

    //BOOL BIT STORAGE

    function _isForSale(uint256 tokenId) internal  view returns (bool) {
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
}
