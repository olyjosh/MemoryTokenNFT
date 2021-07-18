pragma solidity ^0.5.0;

import "./ERC721Full.sol";

contract MemoryToken is ERC721Full {
  // Code goes here...
//    string public name = "Memory Token";
    constructor() ERC721Full ("Memory Token", "MEMORY") public {

    }

    function mint(address _to, string memory _toURI ) public returns(bool){
        uint _tokenID = totalSupply().add(1);
        _mint(_to, _tokenID);
        _setTokenURI(_tokenID, _toURI);
        return false;
    }

}
