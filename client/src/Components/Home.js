import React from "react";
import { Container, Row, Col } from 'react-bootstrap'
import lbirb from '../images/lbirb.svg'
import rbirb from '../images/rbirb.svg'
import '../App.css'

function Home() {

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
                    Fate will tell if the lovers will be reunited to live happily together.<br/><br/>
                    First auction: 2pm EST -  February 14th<br/>
                    Second auction: 2pm EST -  February 16th<br/>
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


