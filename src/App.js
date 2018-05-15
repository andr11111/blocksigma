import React, { Component } from 'react';
import Header from './components/header';
import Profiles from './components/profiles';
import TradeFieldAndGraphs from './components/trade/tradeFieldAndGraphs';
import Form from './components/form';
import './App.css';
//import { contractAPI, web3 } from "./api";
const API_URL = "http://localhost:7545";
const ADDRESS = "0x53DE0dbe22F953F849EF7A79f5ca792129414f59";
const GAS = 1000000;
const Web3 = require('web3');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPopUp: false,
      writerOptionList: [{
        token: 1,
        expire: "10/01/2018",
        capacity: 100,
        price: 43.1,
        type: "call"
      }]
    };

    this.handleButton = this.handleButton.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleNewIssue=this.handleNewIssue.bind(this);
    this.handleDelivery=this.handleDelivery.bind(this);
 /*   contractAPI(API_URL).then((web3API) => {
      this.web3API = web3API;
    }).catch((e) => {
      console.error("Error:", e.message);
    });*/

  };

  handleButton(event) {
    event.preventDefault();
    this.setState({
      isPopUp: true
    });
    if (document.getElementsByClassName('modal-backdrop')[0] === undefined) {
      const elem = document.createElement('div');
      elem.setAttribute('class',  'modal-backdrop fade show');
      document.body.appendChild(elem);
    };
};

handleClose(event) {
  event.preventDefault();
  this.setState({
    isPopUp: false
  });
  var el = document.getElementsByClassName('modal-backdrop')[0];
  el.remove();
};

handleDelivery(event) {
  event.preventDefault();
  console.log(event.target.id);
  console.log(this.state.writerOptionList.slice(0, parseInt(event.target.id)));
  console.log(this.state.writerOptionList.slice(parseInt(event.target.id) + 1));
  this.setState({
    writerOptionList: [...
      this.state.writerOptionList.slice(0, parseInt(event.target.id)), 
      ...this.state.writerOptionList.slice(parseInt(event.target.id) + 1)
    ]
  })
};
  
handleNewIssue(data) {
  this.setState({
    writerOptionList: [...this.state.writerOptionList, data],
    isPopUp: false
  });
  var el = document.getElementsByClassName('modal-backdrop')[0];
  el.remove();
  
};

  testGetTokenPrice = async () => {
    const price = await this.web3API.getTokenPrice();
    console.log("price = ", price.toString());
  };

  testIssue = async () => {
    const result = await this.web3API.issue(10, {
      from: ADDRESS,
      value: 15395000000000000, // 0.015395 ETH
      gas: GAS
    });
    console.log("result = ", result);
  };

  testExercise = async () => {
    const result = await this.web3API.exercise({
      from: ADDRESS,
      value: Web3.utils.toWei("1", "ether"),
      gas: GAS
    });
    console.log("result = ", result);
  };

  testDeliver = async () => {
    const result = await this.web3API.deliver("0x46859BAD5096E67d2b9A5640f3bAb65a3C99A03A", {
      from: ADDRESS,
      gas: GAS
    });
    console.log("result = ", result);
  };

  testForceLiquidation = async () => {
    const result = await this.web3API.forceLiquidation({
      from: ADDRESS,
      gas: GAS
    });
    console.log("result = ", result);
  };

  testDepositReserve = async () => {
    const result = await this.web3API.depositReserve(Web3.utils.toWei("1", "ether"), {
      from: ADDRESS,
      gas: GAS
    });
    console.log("result = ", result);
  };

  render() {
    console.log(this.state.isPopUp);
    return (
      <main className="sigmaTrade">
         <div className="container-fluid">
            <Form
              handleClose={this.handleClose}
              handleNewIssue={this.handleNewIssue}
              isPopUp={this.state.isPopUp}
            />
            <Header />
            <Profiles 
              writerOptionList={this.state.writerOptionList}
              handleDelivery={this.handleDelivery}
              handleButton={this.handleButton}
            />
            <TradeFieldAndGraphs />
          </div>
      </main>
    );
  };
};

export default App;
