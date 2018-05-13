import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux'
import { reducer as reduxFormReducer } from 'redux-form'
import Header from './components/header';
import Profiles from './components/profiles';
import TradeFieldAndGraphs from './components/trade/tradeFieldAndGraphs';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Form from './components/form';
import Home from './components/Home';
import './App.css';
import { contractAPI, web3 } from "./api";
const API_URL = "http://localhost:7545";
const ADDRESS = "0x53DE0dbe22F953F849EF7A79f5ca792129414f59";
const GAS = 1000000;
const Web3 = require('web3');

const reducer = combineReducers({
  form: reduxFormReducer // mounted under "form"
})
const store = (window.devToolsExtension
  ? window.devToolsExtension()(createStore)
  : createStore)(reducer)

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
  this.setState({
    isPopUp: false
  });
  var el = document.getElementsByClassName('modal-backdrop')[0];
  console.log(el);
  el.remove();
};
  
handleNewIssue(data) {
  this.setState({
    writerOptionList: [...this.state.writerOptionList, data]
  });
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

  /*render() {
    if (this.state.isPopUp) {
    return (
      <main className="sigmaTrade">
         <div className="container">
            <Form
              handleClose={this.handleClose}
              handleNewIssue={this.props.handleNewIssue}
            />
            <Header />
            <Profiles 
              writerOptionList={this.state.writerOptionList}
            />
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
           <button onClick={this.testExercise} >exercise</button>
           <button onClick={this.testDeliver} >deliver</button>
           <button onClick={this.testForceLiquidation} >forceLiquidation</button>
           <button onClick={this.testDepositReserve} >depositReserve</button>

            <Header />
            <Profiles
              handleButton={this.handleButton}
              writerOptionList={this.state.writerOptionList}
            />
            <TradeFieldAndGraphs />
          </div>
      </main>
      );
    };
  };*/
  render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider>
          <Home />
        </MuiThemeProvider>
      </Provider>
    )
  };    
};


export default App;
