import React, { Component } from 'react';
import Header from './components/header';
import Profiles from './components/profiles';
import TradeFieldAndGraphs from './components/trade/tradeFieldAndGraphs';
import Form from './components/form';
import './App.css';
import { contractAPI, web3 } from "./api";
const API_URL = "http://localhost:7545";
const ADDRESS = "0x53DE0dbe22F953F849EF7A79f5ca792129414f59";
const GAS = 1000000;
const Web3 = require('web3');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPopUp: false
    };
    this.handleButton = this.handleButton.bind(this);
    this.handleClose = this.handleClose.bind(this);
    contractAPI(API_URL).then((web3API) => {
      this.web3API = web3API;
    }).catch((e) => {
      console.error("Error:", e.message);
    });

  };

  handleButton(event) {
    console.log(event.target);
    this.setState({
      isPopUp: true
    })
};

handleClose(event) {
  console.log(event.target);
  this.setState({
    isPopUp: false
  });
  var el = document.getElementsByClassName('modal-backdrop')[0];
  console.log(el);
  el.remove();
};

  testGetTokenPrice = async () => {
    const price = await this.web3API.getTokenPrice();
    console.log("price = ", price.toString());
  };

  testIssue = async () => {
    console.log("web3 = ", Web3);
    const result = await this.web3API.issue(10, {
      from: ADDRESS,
      value: 15395000000000000, // 0.015395 ETH
      gas: GAS
    });
    console.log("result = ", result);
  };

  render() {
    if (this.state.isPopUp) {
    return (
      <main className="sigmaTrade">
         <div className="container">
            <Form
              handleClose={this.handleClose}
            />
            <Header />
            <Profiles />
            <TradeFieldAndGraphs />
          </div>
      </main>
    )
  } else {
    return (
      <main className="sigmaTrade">
         <div className="container">
           <button onClick={this.testGetTokenPrice} >Get Token Price</button>
           <button onClick={this.testIssue} >issue</button>
            <Header />
            <Profiles
              handleButton={this.handleButton}
            />
            <TradeFieldAndGraphs />
          </div>
      </main>
      );
    };
  };
};

export default App;
