// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "forge-std/Test.sol";
import "../src/LoveBirds.sol";

contract LoverBirdsTest is Test {
    LoveBirds public loveBirds;

    address payable owner;
    address collector1 = vm.addr(1);
    address collector2 = vm.addr(2);

    string[] leftBirbnNoLoveUris = [
        "left bird resting",
        "left bird looking"
    ];

    string[] rightBirbNoLoveUris =[
        "right bird resting",
        "right bird looking" 
    ];

    string[] leftBirbLoveUris = ["left bird found love"];

    string[] rightBirbLoveUris = ["right bird found love"];

    string[] noLoveLeftBirdExpectedUris =[
        'data:application/json;utf8,{"name":"Left Bird", "description":"Life is better when you are with the one you love", "created_by":"Smokestacks & Smartcontrart", "image":"data:image/svg+xml;utf8,left bird resting", "attributes":[]}',
        'data:application/json;utf8,{"name":"Left Bird", "description":"Life is better when you are with the one you love", "created_by":"Smokestacks & Smartcontrart", "image":"data:image/svg+xml;utf8,left bird looking", "attributes":[]}'
    ];

    string[] noLoveRightBirdExpectedUris =[
        'data:application/json;utf8,{"name":"Right Bird", "description":"Life is better when you are with the one you love", "created_by":"Smokestacks & Smartcontrart", "image":"data:image/svg+xml;utf8,right bird resting", "attributes":[]}',
        'data:application/json;utf8,{"name":"Right Bird", "description":"Life is better when you are with the one you love", "created_by":"Smokestacks & Smartcontrart", "image":"data:image/svg+xml;utf8,right bird looking", "attributes":[]}'
    ];

    string[] loveExpectedUris = [
        'data:application/json;utf8,{"name":"Left Bird", "description":"Life is better when you are with the one you love", "created_by":"Smokestacks & Smartcontrart", "image":"data:image/svg+xml;utf8,left bird found love", "attributes":[]}',
        'data:application/json;utf8,{"name":"Right Bird", "description":"Life is better when you are with the one you love", "created_by":"Smokestacks & Smartcontrart", "image":"data:image/svg+xml;utf8,right bird found love", "attributes":[]}'
    ];

    function setUp() public {
        loveBirds = new LoveBirds();
    }

    function testSetUri() public {
        loveBirds.setURI(0, false, leftBirbnNoLoveUris);
        loveBirds.setURI(1, false, rightBirbNoLoveUris);
        loveBirds.setURI(0, true, leftBirbLoveUris);
        loveBirds.setURI(1, true, rightBirbLoveUris);
    }

    function testMint() public {
        loveBirds.mint(collector1);
    }

    function testFailMint() public {
        vm.prank(collector1);
        loveBirds.mint(collector1);
    }

    function testFailMintBothTokensToSameAddress() public {
        loveBirds.mint(collector1);
        loveBirds.mint(collector1);
    }

    function testMintWithDifferentAddresses() public {
        loveBirds.mint(collector1);
        loveBirds.mint(collector2);
    }

    function testURI() public {
        loveBirds.setURI(0, false, leftBirbnNoLoveUris);
        loveBirds.setURI(1, false, rightBirbNoLoveUris);
        loveBirds.setURI(0, true, leftBirbLoveUris);
        loveBirds.setURI(1, true, rightBirbLoveUris);
        loveBirds.mint(collector1);
        loveBirds.mint(collector2);
        vm.roll(0);
        assertEq(loveBirds.tokenURI(0), noLoveLeftBirdExpectedUris[0]);
        assertEq(loveBirds.tokenURI(1), noLoveRightBirdExpectedUris[1]);
        vm.roll(28800);
        assertEq(loveBirds.tokenURI(0), noLoveLeftBirdExpectedUris[0]);
        assertEq(loveBirds.tokenURI(1), noLoveRightBirdExpectedUris[0]);
        vm.roll(57600);
        assertEq(loveBirds.tokenURI(0), noLoveLeftBirdExpectedUris[1]);
        assertEq(loveBirds.tokenURI(1), noLoveRightBirdExpectedUris[0]);
        vm.prank(collector1);
        loveBirds.transferFrom(collector1, collector2, 0);
        assertEq(loveBirds.tokenURI(0), loveExpectedUris[0]);
        assertEq(loveBirds.tokenURI(1), loveExpectedUris[1]);
    }
}
