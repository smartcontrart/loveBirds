import React from "react";
import { Container, Row, Col } from 'react-bootstrap'
import lbirb from '../images/lbirb.svg'
import rbirb from '../images/rbirb.svg'
import '../App.css'

function Home() {

    return ( 
        <Container>
            <Row className="d-flex align-items-center my-5 title">
                <h1><b><a href="" style={{color: "white", textDecoration: 'none'}}>Love Birds, a blockchain love story</a></b></h1>
                <h5 className=""><b>by Smokestacks & Smartcontrart</b></h5>
            </Row>
            <Row className="mb-3">
                <span className="xs-center">
                    The collection includes 2 onchain, dynamic, NFTs.<br/>
                    Both NFTs will be auctioned separately. If a wallet owns one bird, it cannot bid on the second one, but they are meant to be together.<br/>
                    Fate will tell if the lovers will be reunited to live happily together.<br/><br/>
                    <a href="https://love-birds.xyz/noah" style={{color: "white"}}>First auction: 4pm EST -  February 14th</a><br/>
                    <a href="https://love-birds.xyz/allie" style={{color: "white"}}>Second auction: 4pm EST -  February 16th</a><br/>
                    24 hours each
                </span>
            </Row>
            <Row id="description_row">
                <Col xs={12} lg={6} className='mb-5'>
                    <img
                     src={lbirb}
                     alt='visual'
                     className="visual">
                     </img>
                </Col>
                <Col xs={12} lg={6} className='mb-5'>
                    <img
                     src={rbirb}
                     alt='visual'
                     className="visual">
                     </img>
                </Col>
            </Row>
        </Container>
     );
}

export default Home;


