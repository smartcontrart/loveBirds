import React, {useState, useContext, useEffect, useCallback} from "react";
import {Container, Row, Col, Button, Spinner, Alert, Form} from 'react-bootstrap'
import { AccountInfoContext } from "../Context/AccountInfo";
import lbirb from '../images/lbirb.svg'
import '../App.css'

function Noah() {
    let accountInfo = useContext(AccountInfoContext)
    const [alert, setAlert] = useState({active: false, content: null, variant: null})
    const [bid, setBid] =  useState(0);
    const [topBid, setTopBid] = useState(0);
    const [minBid, setMinBid] = useState(0);
    const [topBidder, setTopBidder] = useState(0);
    
    const getAuctionInfo = useCallback(async () => {
        if(accountInfo.instancesLoaded){
            let updatedTopBid = parseInt(await accountInfo.mintContractInstance.methods.currentTopBid().call())
            let updatedMinBid = parseInt(await accountInfo.mintContractInstance.methods.minBid().call())
            let updatedTopBidder = getAccountStr(await accountInfo.mintContractInstance.methods.highestBidder().call())
            let startingPrice = parseInt(await accountInfo.mintContractInstance.methods.startingPrice().call())
            let updatedBid = Math.max(startingPrice, updatedTopBid) + updatedMinBid
            console.log(updatedBid);
            console.log(await accountInfo.mintContractInstance.methods.startingPrice().call()/10**18)
            console.log(updatedTopBid/10**18)
            console.log(updatedMinBid/10**18)
            setTopBid(updatedTopBid)
            setMinBid(updatedMinBid)
            setTopBidder(updatedTopBidder)
            setBid(updatedBid)
            accountInfo.updateAccountInfo({minBid: updatedTopBid})
            accountInfo.updateAccountInfo({currentTopBid: updatedMinBid})
            accountInfo.updateAccountInfo({highestBidder: updatedTopBidder})
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
        }else if(accountInfo.noahsowner !== accountInfo.account){
                if(accountInfo.auctionOpened){
                    return(
                        <Container>
                            <Row>
                                <Col className="m-2 xs-center d-flex no_padding">
                                    {`Current top bidder: ${getAccountStr(topBidder)}`}
                                </Col>
                            </Row>
                            <Row>
                                <Col className="m-2 xs-center d-flex no_padding">
                                    {`Current top bid: ${topBid/10**18} ETH`}
                                </Col>
                            </Row>
                            <Row>
                                <Col className="m-2 xs-center d-flex no_padding">
                                    {`Reserve price: ${accountInfo.reservePrice/10**18} ETH`}
                                </Col>
                            </Row>
                            <Row>
                                <Col className="m-2 xs-center d-flex no_padding">
                                    {renderBidInput()}
                                </Col>
                            </Row>
                            <Row>
                                <Col className="xs-center d-flex no_padding">
                                    {(accountInfo.auctionOpened && accountInfo.account) ? <Button variant='light' style={{width: '150px'}} className='mx-2' onClick={()=>handleBid()}>Bid</Button> : null}
                                </Col>
                            </Row>
                        </Container>
                    )
                }else{ 
                    return <div className="xs-center text-left">Auction Closed</div>
                }
            }else{
                return <div className="xs-center text-left">You already have Noah, so, you can't bid on Allie, but,<br/> please try to bring them together</div>
            }
        // }
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
        console.log(event.target.value*(10**18))
        console.log(topBid)
        console.log(minBid)
        console.log(accountInfo.startingPrice)
        let minimumBid = Math.max(topBid, accountInfo.startingPrice) + minBid
        if(event.target.value*(10**18) < minimumBid){
            setBid(minimumBid);
        }else{
            setBid(event.target.value*10**18)
        }

    }

    function renderBidInput(){
        return(
            <Form style={{width: '150px'}}>
                <Form.Group  controlId="bid">
                    <Form.Control 
                        type="number" 
                        min="0"
                        step=".05"
                        placeholder={bid/10**18}
                        value={bid/10**18}
                        onChange={(event) => handleChange(event)}/>
                </Form.Group>
            </Form>
        )
    }

    async function handleBid(){
        accountInfo.updateAccountInfo({userFeedback: "Bidding..."})
        let minimumBid = Math.max(topBid, accountInfo.startingPrice) + minBid
        if(bid < minimumBid){
            displayAlert(`Minimum bid of ${minimumBid/10**18} not met.`,'warning')
        }else if(accountInfo.walletETHBalance < bid){
            displayAlert(`Not enough ETH to place the bid`,'warning')
        }else if(accountInfo.account === accountInfo.highestBidder){
            displayAlert(`You already are the top bidder`,'warning')
        }else{
            let latestBid =  parseFloat(await accountInfo.mintContractInstance.methods.currentTopBid().call())
            if(latestBid !== accountInfo.minBid && bid <= latestBid){
                displayAlert(`A higher bid was placed before yours`,'warning')
                getAuctionInfo()
            }else{
                try{
                    await accountInfo.mintContractInstance.methods.placeBid(bid.toString()).send({from: accountInfo.account, value: bid})
                    displayAlert('Bid Successful', "success")
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
            <Row id="description_row">
                <Col xs={12} lg={6} className='mb-5'>
                    {/* <img
                     src={lbirb}
                     alt='visual'
                     className="visual">
                     </img> */}
                </Col>
                <Col>
                    {renderUserInterface()}
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

export default Noah;


