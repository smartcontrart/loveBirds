// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/LoveBirds.sol";

contract CounterTest is Test {
    LoveBirds public loveBirds;

    address payable owner;
    address collector1 = vm.addr(1);
    address collector2 = vm.addr(2);

    function setUp() public {
        loveBirds = new LoveBirds();
    }

    function testSetUri(uint256 _tokenId, bool _foundLove, string calldata _uri) public {
        vm.assume(_tokenId < 2);
        loveBirds.setURI(0, _foundLove, _uri);
        loveBirds.setURI(1, _foundLove, _uri);
    }

    function testMint() public {
        loveBirds.mint(collector1);
    }

    function testFailMint() public {
        vm.prank(collector1);
        loveBirds.mint(collector1);
    }

    // function testFailMintBothTokensToSameAddress() public {
    //     loveBirds.mint(collector1);
    //     loveBirds.mint(collector1);
    // }

    function testMintWithDifferentAddresses() public {
        loveBirds.mint(collector1);
        loveBirds.mint(collector2);
    }

    function testURI() public {
        loveBirds.setURI(0, false, '0 false');
        loveBirds.setURI(1, false, '1 false');
        loveBirds.setURI(0, true, '0 true');
        loveBirds.setURI(1, true, '1 true');
        loveBirds.mint(collector1);
        loveBirds.mint(collector2);
        assertEq(loveBirds.tokenURI(0), 'data:application/json;utf8,{"name":"test", "description":"Life is better when you are with the one you love", "created_by":"Smokestacks & Smartcontrart", "image":"data:image/svg+xml;utf8,0 false", "attributes":[]}');
        assertEq(loveBirds.tokenURI(1), 'data:application/json;utf8,{"name":"test", "description":"Life is better when you are with the one you love", "created_by":"Smokestacks & Smartcontrart", "image":"data:image/svg+xml;utf8,1 false", "attributes":[]}');
        vm.prank(collector1);
        loveBirds.transferFrom(collector1, collector2, 0);
        assertEq(loveBirds.tokenURI(0), 'data:application/json;utf8,{"name":"test", "description":"Life is better when you are with the one you love", "created_by":"Smokestacks & Smartcontrart", "image":"data:image/svg+xml;utf8,0 true", "attributes":[]}');
        assertEq(loveBirds.tokenURI(1), 'data:application/json;utf8,{"name":"test", "description":"Life is better when you are with the one you love", "created_by":"Smokestacks & Smartcontrart", "image":"data:image/svg+xml;utf8,1 true", "attributes":[]}');
    }
}
