pragma solidity 0.5.7;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "@aztec/protocol/contracts/ERC1724/ZkAsset.sol";

contract MockDitto is ERC20 {
    constructor() public {
        _mint(msg.sender, 1e27);
    }
}

contract ZkDittoFactory {
    address public ace;
    mapping (address=>ZkAsset) public zkDittos; 

    constructor(address _ace) public {
        ace = _ace;
    }

    function deployZkDitto(address _ditto) external {
        require(zkDittos[_ditto] == ZkAsset(0), "ZkDittoFactory: ZkDitto already exists for the given ditto");
        zkDittos[_ditto] = new ZkAsset(ace, _ditto, 1);
    }
}