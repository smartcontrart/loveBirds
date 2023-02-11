// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "forge-std/Test.sol";
import "../src/LoveBirds.sol";
import "../src/LoveBirdsAuction.sol";

contract CounterTest is Test {
    LoveBirds public loveBirds;
    LoveBirdsAuction public auction;

    address payable owner;
    address payable auctionBeneficiary = payable(vm.addr(1));
    address collector1 = vm.addr(2);
    address collector2 = vm.addr(3);
    address collector3 = vm.addr(4);

    uint256 startingPrice = 0.05 ether;
    uint256 reservePrice = 0.2 ether;
    uint256 minBid = 0.01 ether;

    function setUp() public {
        loveBirds = new LoveBirds();
        auction = new LoveBirdsAuction();
        loveBirds.toggleAdmin(address(auction));
    }

    function setUpAuction() public {
        auction.setUpAuction(
            address(loveBirds),
            startingPrice,
            reservePrice,
            minBid,
            auctionBeneficiary
        );
    }

    function placeBid(uint256 _value, uint256 _amount) public {
        auction.placeBid{value: _value}(_amount);   
    }


    function testToggleAdmin() public {
        auction.toggleAdmin(collector1);
    }

    function testFailToggleAdmin(address admin) public {
        vm.assume(admin != owner);
        vm.prank(admin);
        auction.toggleAdmin(admin);
    }

    // TESTS SETUP AUCTION

    function testSetUpAuction() public {
        setUpAuction();
    }

    function testFailSetUpAuction() public {
        vm.prank(collector1);
        setUpAuction();
    }

    // TESTS SETUP AUCTION

    function testStartAuction() public {
        setUpAuction();
        auction.startAuction();
    }

    function testFailStartAuction() public {
        setUpAuction();
        vm.prank(collector1);
        auction.startAuction();
    }

    // TESTS PLACE BID

    function testPlaceBid(uint256 _amount) public {
        setUpAuction();
        auction.startAuction();
        vm.prank(collector1);
        vm.assume(_amount > (startingPrice + minBid) && _amount < 1 ether);
        vm.deal(collector1, 1 ether);
        placeBid(_amount, _amount);
    }


    function testFailPlaceBidTooLow(uint256 _amount) public {
        setUpAuction();
        auction.startAuction();
        vm.prank(collector1);
        vm.assume(_amount < startingPrice + minBid);
        vm.deal(collector1, 1 ether);
        placeBid(_amount, _amount);
    }

    function testFailPlaceBidWithInsufficientFunds(uint256 _amount) public {
        setUpAuction();
        auction.startAuction();
        vm.prank(collector1);
        vm.assume(_amount > startingPrice + minBid);
        vm.deal(collector1, 1 ether);
        placeBid(_amount-1, _amount);
    }

    // TESTS PLACE SUBSEQUENT BID

    function testPlaceSubsequentBid(uint256 _amount1) public {
        setUpAuction();
        auction.startAuction();
        vm.prank(collector1);
        vm.assume(_amount1 > (startingPrice + minBid) && _amount1 < 1 ether);
        vm.deal(collector1, 1 ether);
        placeBid(_amount1, _amount1);
        vm.prank(collector2);
        vm.deal(collector2, 10 ether);
        uint256 bid = auction.currentTopBid() + minBid;
        placeBid(bid, bid);
    }

    function testFailPlaceSubsequentBidTooLow(uint256 _amount1, uint256 _amount2) public {
        setUpAuction();
        auction.startAuction();
        vm.prank(collector1);
        vm.assume(_amount1 > startingPrice + minBid);
        vm.deal(collector1, 1 ether);
        placeBid(_amount1, _amount1);
        vm.prank(collector2);
        vm.deal(collector2, 1 ether);
        vm.assume(_amount2 < auction.currentTopBid() + minBid);
        placeBid(_amount2, _amount2);
    }

    // TESTS CANCEL AUCTION

    function testCancelAuction(uint256 _amount)public{
        setUpAuction();
        auction.startAuction();
        vm.prank(collector1);
        vm.assume(_amount > (startingPrice + minBid) && _amount < 1 ether);
        vm.deal(collector1, 1 ether);
        placeBid(_amount, _amount);
        auction.cancelAuction();
    }

    function testFailCancelAuction(uint256 _amount)public{
        setUpAuction();
        auction.startAuction();
        vm.startPrank(collector1);
        vm.assume(_amount > (startingPrice + minBid) && _amount < 1 ether);
        vm.deal(collector1, 1 ether);
        placeBid(_amount, _amount);
        auction.cancelAuction();
    }

    // TESTS SETTLE AUCTION

    function testSettleAuction(uint256 _amount)public{
        setUpAuction();
        auction.startAuction();
        vm.prank(collector1);
        vm.assume(_amount > (startingPrice + minBid) && _amount < 1 ether);
        vm.deal(collector1, 1 ether);
        placeBid(_amount, _amount);
        auction.settleAuction();
    }


    function testFailSettleAuction(uint256 _amount)public{
        setUpAuction();
        auction.startAuction();
        vm.startPrank(collector1);
        vm.assume(_amount > (startingPrice + minBid) && _amount < 1 ether);
        vm.deal(collector1, 1 ether);
        placeBid(_amount, _amount);
        auction.settleAuction();
    }

    // TESTS WITHDRAW FUNDS
    function testWithdrawFunds() public {
        vm.deal(address(auction), 1 ether);
        auction.withdrawContractFunds(auctionBeneficiary, 0.5 ether);
        auction.withdrawContractFunds(auctionBeneficiary, 0.5 ether);
        vm.deal(address(auction), 1 ether);
        auction.withdrawContractFunds(auctionBeneficiary, 0);
        vm.deal(address(auction), 1 ether);
        auction.withdrawContractFunds(auctionBeneficiary, 2 ether   );
    }

    function testFailWithdrawFundsFromCollector() public {
        vm.prank(collector1);
        vm.deal(address(auction), 1 ether);
        auction.withdrawContractFunds(auctionBeneficiary, 0.5 ether);
    }




}
