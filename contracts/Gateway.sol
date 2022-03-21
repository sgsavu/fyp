// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "./Marketplace.sol";
import "./Vehicle.sol";

/*
This contract is a superset of Marketplace and acts as a gateway between
the users and the marketplace. It places a significant number of restrictions on
the basic functionalities of the market. It also keeps a profit from each transaction
and acts as a treasury.
*/
contract Gateway is Marketplace {
    event NewPrice(uint256 indexed tokenId);
    event NewTopBidder(uint256 indexed tokenId);
    event SaleStatus(uint256 indexed tokenId, bool status);
    uint256 tax = 100000000000000 wei;
    Vehicle vhc;

    receive() external payable {}

    struct getObject {
        uint256[] ids;
        string[] uris;
        address[] owners;
        address[] garages;
        bool[] sales;
        uint256[] prices;
        bool[] auctions;
        address[] bidders;
    }

    function refreshOne(uint256 tokenId)
        public
        view
        returns (getObject memory)
    {
        getObject memory getObject1;

        uint256[] memory ids = new uint256[](1);
        string[] memory uris = new string[](1);
        address[] memory owners = new address[](1);
        address[] memory garages = new address[](1);
        bool[] memory sales = new bool[](1);
        uint256[] memory prices = new uint256[](1);
        bool[] memory auctions = new bool[](1);
        address[] memory bidders = new address[](1);

        ids[0] = tokenId;
        uris[0] = vhc.tokenURI(tokenId);
        owners[0] = vhc.ownerOf(tokenId);
        garages[0] = vhc.getApprovedGarage(tokenId);

        bool isForSale = _isForSale(tokenId);
        sales[0] = isForSale;

        if (isForSale) {
            prices[0] = _getVehiclePrice(tokenId);
            bool isAuction = _isAuction(tokenId);

            auctions[0] = isAuction;

            if (isAuction) {
                bidders[0] = _getTopBidder(tokenId);
            }
        }

        getObject1.ids = ids;
        getObject1.uris = uris;
        getObject1.owners = owners;
        getObject1.garages = garages;
        getObject1.sales = sales;
        getObject1.prices = prices;
        getObject1.auctions = auctions;
        getObject1.bidders = bidders;

        return getObject1;
    }

    function getEverything() public view returns (getObject memory) {
        getObject memory getObject1;

        uint256 totalSupply = vhc.totalSupply();

        uint256[] memory ids = new uint256[](totalSupply);
        string[] memory uris = new string[](totalSupply);
        address[] memory owners = new address[](totalSupply);
        address[] memory garages = new address[](totalSupply);
        bool[] memory sales = new bool[](totalSupply);
        uint256[] memory prices = new uint256[](totalSupply);
        bool[] memory auctions = new bool[](totalSupply);
        address[] memory bidders = new address[](totalSupply);

        for (uint256 i = 0; i < totalSupply; i++) {
            uint256 index = vhc.tokenByIndex(i);

            ids[i] = index;
            uris[i] = vhc.tokenURI(index);
            owners[i] = vhc.ownerOf(index);
            garages[i] = vhc.getApprovedGarage(index);

            bool isForSale = _isForSale(index);
            sales[i] = isForSale;

            if (isForSale) {
                uint256 price = _getVehiclePrice(index);
                prices[i] = price;

                bool isAuction = _isAuction(index);
                auctions[i] = isAuction;

                if (isAuction) {
                    address topBidder = _getTopBidder(index);
                    bidders[i] = topBidder;
                }
            }
        }

        getObject1.ids = ids;
        getObject1.uris = uris;
        getObject1.owners = owners;
        getObject1.garages = garages;
        getObject1.sales = sales;
        getObject1.prices = prices;
        getObject1.auctions = auctions;
        getObject1.bidders = bidders;

        return getObject1;
    }

    function getMarketVehicles() public view returns (getObject memory) {
        getObject memory getObject1;

        uint256 totalSupply = vhc.totalSupply();

        bool[] memory sales = new bool[](totalSupply);
        uint256[] memory prices = new uint256[](totalSupply);
        bool[] memory auctions = new bool[](totalSupply);
        address[] memory bidders = new address[](totalSupply);

        for (uint256 i = 0; i < totalSupply; i++) {
            uint256 index = vhc.tokenByIndex(i);

            bool isForSale = _isForSale(index);
            sales[i] = isForSale;

            if (isForSale) {
                uint256 price = _getVehiclePrice(index);
                prices[i] = price;

                bool isAuction = _isAuction(index);
                auctions[i] = isAuction;

                if (isAuction) {
                    address topBidder = _getTopBidder(index);
                    bidders[i] = topBidder;
                }
            }
        }

        getObject1.sales = sales;
        getObject1.prices = prices;
        getObject1.auctions = auctions;
        getObject1.bidders = bidders;

        return getObject1;
    }

    constructor(address addr) {
        vhc = Vehicle(addr);
    }

    function balanceOfSC() public view returns (uint256) {
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

        _secureMoneyTransfer(
            vhc.ownerOf(tokenId),
            _getVehiclePrice(tokenId) - tax
        );

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
