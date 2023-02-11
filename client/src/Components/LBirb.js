import React, {useState, useContext, useEffect, useCallback} from "react";
import {Container, Row, Col, Button, Spinner, Alert, Form} from 'react-bootstrap'
import { AccountInfoContext } from "../Context/AccountInfo";
import lbirb from '../images/lbirb.svg'
import '../App.css'

function LBirb() {
    let accountInfo = useContext(AccountInfoContext)
    const [alert, setAlert] = useState({active: false, content: null, variant: null})
    const [bid, setBid] =  useState(0);
    const [topBid, setTopBid] = useState(0);
    const [minBid, setMinBid] = useState(0);
    const [topBidder, setTopBidder] = useState(0);
    
    const getAuctionInfo = useCallback(async () => {
        if(accountInfo.instancesLoaded){
            const topBid2 = 1
            const minBid2 = 2
            const topBidder2 = 'o0x'
            // const topBid2 = parseFloat(await accountInfo.Act1MintInstance.methods._currentTopBid().call())
            // const minBid2 = parseFloat(await accountInfo.Act1MintInstance.methods._minBid().call())
            // const topBidder2 = getAccountStr(await accountInfo.Act1MintInstance.methods._highestBidder().call())
            setTopBid(topBid2)
            setMinBid(minBid2)
            setTopBidder(topBidder2)
        }
      }, [accountInfo.instancesLoaded])

    useEffect(()=>{
        getAuctionInfo();
    },[getAuctionInfo])


    function displayAlert( message, variant){
        setAlert({active: true, content: message, variant: variant})
        setTimeout(function() { setAlert({active: false, content: null, variant: null}); }, 10000);
    }

    function renderUserInterface(){
        if(!window.ethereum || !accountInfo.account){
            return <div>Please connect your wallet</div>
        }else if(accountInfo.act1Opened){
            return(
                <Container>
                    <Row>
                        <Col className="m-2 xs-center d-flex no_padding">
                            {renderBidInput()}
                        </Col>
                    </Row>
                </Container>
            )
        }else{ return <div className="xs-center text-left">Auction Ended</div>}
    }

    function renderUserFeedback(){
        if(accountInfo.userFeedback){
            return(
                <React.Fragment>
                    <div>
                        <Spinner animation="grow" variant="light"/>
                    </div>
                    <div>{accountInfo.userFeedback}</div>
                </React.Fragment>
            )
        }
    }

    function renderAlert(){
        if(alert.active){
            return(
            <Col className='m-'>
                <br/><br/>
                <Alert variant={alert.variant}>{alert.content}</Alert>
            </Col>
            )
        }
    }


    async function handleChange(event){
        if(event.target.value*(10**18) < accountInfo.auctionCurrentTopBid + accountInfo.auctionMinBid){
            setBid(accountInfo.auctionCurrentTopBid + accountInfo.auctionMinBid);
        }else{
            setBid(event.target.value*10**18)
        }

    }

    function renderBidInput(){
        return(
            <Form>
                <Form.Group  controlId="bid">
                    <Form.Control 
                        type="number" 
                        min="0"
                        step=".01"
                        placeholder={bid/10**18}
                        value={bid/10**18}
                        onChange={(event) => handleChange(event)}/>
                </Form.Group>
            </Form>
        )
    }

    async function handleBid(){
        accountInfo.updateAccountInfo({userFeedback: "Bidding..."})
        let minimumBid = accountInfo.auctionCurrentTopBid + accountInfo.auctionMinBid
        
        if(bid < minimumBid){
            displayAlert(`Minimum bid of ${minimumBid/10**18} not met.`,'warning')
        }else if(accountInfo.walletETHBalance < bid){
            displayAlert(`Not enough ETH to place the bid`,'warning')
        }else{
            let latestBid =  parseFloat(await accountInfo.Act1MintInstance.methods._currentTopBid().call())
            if(bid <= latestBid){
                displayAlert(`A higher bid was placed before yours`,'warning')
                getAuctionInfo()
            }else{
                try{
                    await accountInfo.Act1MintInstance.methods.placeBid(bid.toString()).send({from: accountInfo.account, value: bid})
                    displayAlert('Mint Successful', "success")
                    getAuctionInfo()
                }
                catch(error){
                    accountInfo.updateAccountInfo({userFeedback: null})
                    displayAlert(error.message,'warning')
                }
            }
        }
        accountInfo.updateAccountInfo({userFeedback: null})
    }

    function getAccountStr(account){
        let response = account.slice(0, 5) +  '...' + account.substring(account.length - 2)
        return response
      }

    return ( 
        <Container>
            <Row className="d-flex align-items-center my-5 title">
                <h1><b>Love Birds, a blockchain love story</b></h1>
                <h5 className=""><b>by Smokestacks & Smartcontrart</b></h5>
            </Row>
            <Row className="mb-3">
                <span className="xs-center">
                    The collection includes 2 onchain, dynamic, NFTs.<br/>
                    Both NFTs will be auctioned separately. If a wallet owns one bird, it cannot bid on the second one, but they are meant to be together.<br/>
                    Fate will tell if the lovers will be reunited to live happily together.
                    First auction: February 14th<br/>
                    Second auction: February 16th
                </span>
            </Row>
            <Row id="description_row">
                <Col xs={12} lg={6} className='mb-5'>
                    <img
                     src={birb1}
                     alt='visual'
                     className="visual">
                     </img>
                </Col>
                <Col xs={12} lg={6} className='mb-5'>
                    <img
                     src={birb2}
                     alt='visual'
                     className="visual">
                     </img>
                </Col>
            </Row>
            <Row className='mb-3'>
                {renderUserFeedback()}
            </Row>
            <Row className="Home_row">  
                {renderAlert()}
            </Row>
        </Container>
     );
}

export default LBirb;


