// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import 'forge-std/Script.sol';
import '../src/LoveBirds.sol';
import '../src/LoveBirdsAuction.sol';

contract LoveBirdsAuctionScript is Script {
    function setUp() public {}
    LoveBirdsAuction public auction;
    LoveBirds public loveBirds;

    uint256 startingPrice = 0.3 ether;
    uint256 reservePrice = 0.3 ether;
    uint256 minBid = 0.01 ether;

    address loveBirdsAddress = 0x067e7064b3E3783DADAFF47aF3c9C4b2eA7A4403;
    address auctionBeneficiary = 0xe830C0D6B74E1Dc2767Ea3b36F8Eb359188B3D90;
    // address loveBirdsAddress = 0x71dC7EC391E83708A9Be502f9512a08167909a67;
    // address auctionBeneficiary = 0x66806e42191E65968Cd520D2615566E24368Ef12;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint('PRIVATE_KEY');
        vm.startBroadcast(deployerPrivateKey);

        auction = new LoveBirdsAuction();
        loveBirds = LoveBirds(loveBirdsAddress);
        loveBirds.toggleAdmin(address(auction));
        
        auction.setUpAuction(
            address(loveBirds),
            startingPrice,
            reservePrice,
            minBid,
            auctionBeneficiary
        );

        vm.stopBroadcast();
    }
}