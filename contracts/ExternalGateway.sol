pragma solidity >=0.6.0 <0.9.0;

import "./Vehicle.sol";

contract ExternalGateway is Vehicle {
    function createVehicle(string memory uri)
        external
        onlyClass(ROLE_CLASS.MINTER)
        onlyIfNotRegistered(uri)
    {
        mint(uri);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        onlyIfExists(tokenId)
        returns (string memory)
    {
        return _tokenURIs[tokenId];
    }

    function getVehiclePrice(uint256 tokenId)
        external
        view
        onlyIfExists(tokenId)
        onlyIfForSale(tokenId)
        returns (uint256)
    {
        return _getVehiclePrice(tokenId);
    }

    function getBid(uint256 tokenId, address _account)
        external
        view
        returns (uint256)
    {
        return _getBid(tokenId, _account);
    }

    function getTopBidder(uint256 tokenId)
        external
        view
        onlyIfExists(tokenId)
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

    function concludeAuction(uint256 tokenId)
        external
        onlyOwnerOf(tokenId)
        onlyIfAuction(tokenId)
    {
        _concludeAuction(tokenId);
    }

    function listAuction(uint256 tokenId, uint256 price)
        external
        onlyIfExists(tokenId)
        onlyOwnerOf(tokenId)
        onlyIfNotForSale(tokenId)
        onlyIfNotAuction(tokenId)
        onlyIfPriceNonNull(price)
    {
        _listAuction(tokenId, price);
    }

    function listForSale(uint256 tokenId, uint256 price)
        external
        onlyIfExists(tokenId)
        onlyOwnerOf(tokenId)
        onlyIfNotForSale(tokenId)
        onlyIfPriceNonNull(price)
    {
        _listForSale(tokenId, price);
    }

    function removeFromSale(uint256 tokenId)
        external
        onlyIfExists(tokenId)
        onlyIfForSale(tokenId)
        onlyOwnerOf(tokenId)
    {
        _removeFromSale(tokenId);
    }

    function setVehiclePrice(uint256 tokenId, uint256 _price)
        external
        onlyOwnerOf(tokenId)
        onlyIfNotAuction(tokenId)
        onlyIfPriceNonNull(_price)
    {
        _setVehiclePrice(tokenId, _price);
    }

    function buyVehicle(uint256 tokenId)
        external
        payable
        onlyIfExists(tokenId)
        onlyIfForSale(tokenId)
        onlyIfNotAuction(tokenId)
    {
        require(
            msg.value == _getVehiclePrice(tokenId),
            "Money sent either not enough or too much."
        );

        _classicExchange(ownerOf(tokenId), msg.sender, tokenId, msg.value);
        _removeFromSale(tokenId);
    }

    function bidVehicle(uint256 tokenId)
        external
        payable
        onlyIfExists(tokenId)
        onlyIfAuction(tokenId)
    {
        require(msg.value > _getVehiclePrice(tokenId));
        require(msg.sender != ownerOf(tokenId));

        uint256 currentBid = _getBid(tokenId, msg.sender);
        if (currentBid != 0) _secureMoneyTransfer(msg.sender, currentBid);

        _secureMoneyTransfer(address(this), msg.value);
        _setBid(tokenId, msg.sender, msg.value);
        _setVehiclePrice(tokenId, msg.value);
        _setTopBidder(tokenId, msg.sender);
    }

    function withdrawBid(uint256 tokenId) external onlyIfNotTopBidder(tokenId) {
        uint256 bid = _getBid(tokenId, msg.sender);
        require(bid > 0, "No bid to retrieve");
        _setBid(tokenId, msg.sender, 0);
        _secureMoneyTransfer(msg.sender, bid);
    }

    function destroyVehicle(uint256 _tokenId) external {
        burn(_tokenId);
    }

    function getTotalNrOfRegisteredVehicles() external view returns (uint256) {
        return getTokenIdsCurrent();
    }

    function getIfTokenExists(uint256 tokenId) external view returns (bool) {
        return _exists(tokenId);
    }

}
