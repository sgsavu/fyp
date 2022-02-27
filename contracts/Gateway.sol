// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;


contract Gateway {

    event NewPrice(uint256 indexed tokenId);
    event NewTopBidder(uint256 indexed tokenId);
    event SaleStatus(uint256 indexed tokenId, bool status, bool isAuction);

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

    ///

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

    function listInstant(uint256 tokenId, uint256 price)
        external
        onlyOwnerOf(tokenId)
        onlyIfNotForSale(tokenId)
        onlyIfPriceNonNull(price)
    {
        _listForSale(tokenId, price);
        emit SaleStatus(tokenId, true, false);
    }

    function delistAuction(uint256 tokenId)
        external
        onlyIfForSale(tokenId)
        onlyOwnerOf(tokenId)
    {
        _refundCurentTopBidder(tokenId);
        _removeFromSale(tokenId);
        emit SaleStatus(tokenId, false, false);
    }

    function delistInstant(uint256 tokenId)
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
            "E9"
        );

        _classicExchange(ownerOf(tokenId), msg.sender, tokenId, msg.value);

        emit SaleStatus(tokenId, false, false);
    }

    function bidVehicle(uint256 tokenId)
        external
        payable
        onlyIfAuction(tokenId)
    {
        require(
            msg.value > _getVehiclePrice(tokenId),
            "E10"
        );
        require(
            msg.sender != ownerOf(tokenId),
            "E11"
        );

        _secureMoneyTransfer(address(this), msg.value);
       
        emit NewPrice(tokenId);
        emit NewTopBidder(tokenId);
    }

    function concludeAuction(uint256 tokenId)
        external
        onlyOwnerOf(tokenId)
        onlyIfAuction(tokenId)
    {
        _secureMoneyTransfer(address(this), _getVehiclePrice(tokenId));
        _concludeAuction(tokenId);
        emit SaleStatus(tokenId, false, false);
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
