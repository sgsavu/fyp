// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "./Vehicle.sol";

contract ExternalGateway is Vehicle {
    event NewPrice(uint256 indexed tokenId);
    event NewTopBidder(uint256 indexed tokenId);

    function exists(uint256 tokenId) external view returns (bool) {
        return _exists(tokenId);
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

    function getVehiclePrice(uint256 tokenId)
        external
        view
        onlyIfForSale(tokenId)
        returns (uint256)
    {
        return _getVehiclePrice(tokenId);
    }

    function getTopBidder(uint256 tokenId)
        external
        view
        onlyIfAuction(tokenId)
        returns (address)
    {
        return _getTopBidder(tokenId);
    }

    function isAuction(uint256 tokenId) external view returns (bool) {
        return _isAuction(tokenId);
    }

    function isForSale(uint256 tokenId) external view returns (bool) {
        return _isForSale(tokenId);
    }

    function concludeAuction(uint256 tokenId)
        external
        onlyOwnerOf(tokenId)
        onlyIfAuction(tokenId)
    {
        _concludeAuction(tokenId);
        emit SaleStatus(tokenId, false, false);
    }

    function listAuction(uint256 tokenId, uint256 price)
        external
        onlyOwnerOf(tokenId)
        onlyIfNotForSale(tokenId)
        onlyIfNotAuction(tokenId)
        onlyIfPriceNonNull(price)
    {
        _listAuction(tokenId, price);
        emit SaleStatus(tokenId, true, true);
    }

    function listForSale(uint256 tokenId, uint256 price)
        external
        onlyOwnerOf(tokenId)
        onlyIfNotForSale(tokenId)
        onlyIfPriceNonNull(price)
    {
        _listForSale(tokenId, price);
        emit SaleStatus(tokenId, true, false);
    }

    function removeFromSale(uint256 tokenId)
        external
        onlyIfForSale(tokenId)
        onlyOwnerOf(tokenId)
    {
        _removeFromSale(tokenId);
        emit SaleStatus(tokenId, false, false);
    }

    function setVehiclePrice(uint256 tokenId, uint256 _price)
        external
        onlyOwnerOf(tokenId)
        onlyIfNotAuction(tokenId)
        onlyIfPriceNonNull(_price)
    {
        _setVehiclePrice(tokenId, _price);
        emit NewPrice(tokenId);
    }

    function buyVehicle(uint256 tokenId)
        external
        payable
        onlyIfForSale(tokenId)
        onlyIfNotAuction(tokenId)
    {
        require(
            msg.value == _getVehiclePrice(tokenId),
            "Money sent either not enough or too much."
        );

        _classicExchange(ownerOf(tokenId), msg.sender, tokenId, msg.value);
        _removeFromSale(tokenId);
        emit SaleStatus(tokenId, false, false);
    }

    function bidVehicle(uint256 tokenId)
        external
        payable
        onlyIfAuction(tokenId)
    {
        require(
            msg.value > _getVehiclePrice(tokenId),
            "Bid must be higher than the current price."
        );
        require(
            msg.sender != ownerOf(tokenId),
            "You cannot bid on your own auction."
        );

        _secureMoneyTransfer(address(this), msg.value);
        _refundCurentTopBidder(tokenId);
        _setVehiclePrice(tokenId, msg.value);
        _setTopBidder(tokenId, msg.sender);
        emit NewPrice(tokenId);
        emit NewTopBidder(tokenId);
    }

    function createVehicle(string memory uri)
        external
        onlyClass(ROLE_CLASS.MINTER)
    {
        mint(uri);
    }

    function destroyVehicle(uint256 _tokenId)
        external
        onlyClass(ROLE_CLASS.AUTHORITY)
    {
        _removeFromSale(_tokenId);
        burn(_tokenId);
        emit SaleStatus(_tokenId, false, false);
    }

    //ODOMETER

    function getOdometerValue(uint256 tokenId) external view returns (uint256) {
        return _odometerValue[tokenId];
    }

    function increaseOdometer(uint256 tokenId, uint256 value)
        external
        onlyRole(ODOMETER_ROLE)
    {
        require(msg.sender == _odometerAddress[tokenId]);
        _odometerValue[tokenId] = _odometerValue[tokenId] + value;
    }

    function setOdometerAddress(uint256 tokenId, address odometer)
        external
        onlyRole(AUTHORITY_ROLE_ADMIN)
    {
        _odometerAddress[tokenId] = odometer;
    }
}
