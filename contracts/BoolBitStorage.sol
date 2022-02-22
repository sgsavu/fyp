// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

library BoolBitStorage {
    function _getBoolean(uint256 _packedBools, uint256 _boolNumber)
        public
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
    ) public pure returns (uint256) {
        if (_value) return _packedBools | (uint256(1) << _boolNumber);
        else return _packedBools & ~(uint256(1) << _boolNumber);
    }

    function _tokenIdToBoolBit(uint256 tokenId)
        public
        pure
        returns (uint256, uint256)
    {
        uint256 multiplier = tokenId / 256;
        uint256 position = tokenId - (256 * multiplier);
        return (multiplier, position);
    }
}
