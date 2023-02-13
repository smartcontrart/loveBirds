import React, { Component } from "react";
import Web3 from "web3";
import { Button } from "react-bootstrap";
import { AccountInfoContext } from '../Context/AccountInfo'
import Contract  from "../contracts/LoveBirds.json";
import MintContract  from "../contracts/LoveBirdsAuction.json";

class Connect extends Component {
  
  static contextType =  AccountInfoContext
  
  componentDidMount = async () => {

    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      this.web3  = new Web3(window.web3.currentProvider);
    }else{
      var provider = `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID1}`
      var web3Provider = new Web3.providers.HttpProvider(provider);
      this.web3 = new Web3(web3Provider);
    };
    this.context.updateAccountInfo({web3: this.web3})
    if(this.web3){
      await this.setNetwork();
      await this.getContractsInstances();
      if(window.ethereum || window.web3){
        await this.setAccount();
      }
      
    }
  }

  async getContractsInstances(){
    
    if(this.context.networkId === parseInt(process.env.REACT_APP_MAINNET_NETWORK)){
      this.context.updateAccountInfo({contractAddress: process.env.REACT_APP_MAINNET_CONTRACT_ADDRESS})
      this.context.updateAccountInfo({mintContractAddress: process.env.REACT_APP_MAINNET_CONTRACT_MINT_ADDRESS})
    }else{
      this.context.updateAccountInfo({contractAddress: process.env.REACT_APP_GOERLI_CONTRACT_ADDRESS})
      this.context.updateAccountInfo({mintContractAddress: process.env.REACT_APP_GOERLI_CONTRACT_MINT_ADDRESS})
    }

    this.contractInstance = new this.web3.eth.Contract(
      Contract.abi,
      parseInt(this.context.contractAddress) && this.context.contractAddress
    )
    this.mintContractInstance = new this.web3.eth.Contract(
      MintContract.abi,
      parseInt(this.context.mintContractAddress) && this.context.mintContractAddress
    )
    
    await this.context.updateAccountInfo({contractInstance: this.contractInstance})
    await this.context.updateAccountInfo({mintContractInstance: this.mintContractInstance})
    await this.getContractData();
    await this.getMintContractData();
    this.context.updateAccountInfo({instancesLoaded: true})
  }

  async setAccount(){
    if(this.context.networkId !== null){
      let accounts = await this.web3.eth.getAccounts();
      await this.getContractsInstances();
      await this.context.updateAccountInfo({account: accounts[0]});
      if(this.context.account) this.getAccountsData(accounts[0])
    }else{
      this.resetAccountData();
    }
  }

  resetAccountData(){
    this.context.updateAccountInfo({
      account: null,
    })
  }

  async setNetwork(){
      let networkId = await this.web3.eth.getChainId();
      this.context.updateAccountInfo({networkId: networkId})
  }

  async getAccountsData(account){
      this.context.updateAccountInfo({walletETHBalance: await this.web3.eth.getBalance(this.context.account)});
  }

  async getContractData(){
    if(this.context.networkId){
      try{
        this.context.updateAccountInfo({noahsowner: await this.contractInstance.methods.ownerOf(0).call()})
      }catch(err){
        this.context.updateAccountInfo({noahsowner: null})
      }
    }
  }

  async getMintContractData(){
    if(this.context.networkId){
      this.context.updateAccountInfo({auctionOpened: await this.mintContractInstance.methods.isLive().call()})
      this.context.updateAccountInfo({startingPrice: parseInt(await this.mintContractInstance.methods.startingPrice().call())})
      this.context.updateAccountInfo({reservePrice: parseInt(await this.mintContractInstance.methods.reservePrice().call())})
      this.context.updateAccountInfo({minBid: parseInt(await this.mintContractInstance.methods.minBid().call())})
      this.context.updateAccountInfo({currentTopBid: parseInt(await this.mintContractInstance.methods.currentTopBid().call())})
      this.context.updateAccountInfo({highestBidder: parseInt(await this.mintContractInstance.methods.highestBidder().call())})
    }
  }

  async connectWallet(){
    this.context.updateAccountInfo({transactionInProgress: true})
    try{
      window.ethereum.enable()
    }catch(error){
      console.log(error)
    }
    this.context.updateAccountInfo({transactionInProgress: false})
  }

  getAccountStr(account){
    let response = account.slice(0, 5) +  '...' + account.substring(account.length - 2)
    return response
  }

  renderUserInterface(){
    if(!this.context.account){
      return <Button variant="outline-light" onClick={() => this.connectWallet()}>Connect</Button>
    }else return <Button variant="outline-light">Connected as {this.getAccountStr(this.context.account)}</Button>
  }

  render() {

    if(window.ethereum || window.web3){
      if(this.web3){
        window.ethereum.on('accountsChanged', async () => {
          await this.setAccount()
        })
        window.ethereum.on('chainChanged', async () => {
          await this.setNetwork()
          await this.setAccount();
        });
  
      }
    }
    return this.renderUserInterface()
  }
  
}


export default Connect;
