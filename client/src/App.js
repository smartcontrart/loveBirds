import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Home from './Components/Home';
import Noah from './Components/Noah';
import Allie from './Components/Allie';
import Connect from './Components/Connect';
import ConnexionStatus from './Components/ConnexionStatus';
import AccountInfoProvider from './Context/AccountInfo';
import {Routes,Route} from "react-router-dom";
import './App.css'

function App() {
  return (
        <AccountInfoProvider>
              <div className="App d-flex align-items-center justify-content-center">
                <Container>
                    <Row className="d-flex align-items-center justify-content-center">
                      <Col className="d-flex align-items-center justify-content-center">
                        <Routes>
                          <Route path="/" element={<Home/>}/>
                          <Route path="/noah" element={<Noah/>}/>
                          <Route path="/allie" element={<Allie/>}/>
                        </Routes>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="">
                        <ConnexionStatus/>
                      </Col>
                    </Row>
                    <Connect/>
                </Container>
              </div>
        </AccountInfoProvider>
  );
}

export default App;