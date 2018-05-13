import React, { Component } from 'react';

import Header from './components/header';
import Profiles from './components/profiles';
import TradeFieldAndGraphs from './components/trade/tradeFieldAndGraphs';
import Form from './components/form';
import './App.css';
const API_URL = "http://localhost:7545";

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
    console.log("here");
    const price = await this.web3API.getTokenPrice();
    console.log("price = ", price);
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
           <button onClick={this.testGetTokenPrice} >Test Clss 1</button>
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
