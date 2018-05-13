import React, { Component } from 'react';

import Header from './components/header';
import Profiles from './components/profiles';
import TradeFieldAndGraphs from './components/trade/tradeFieldAndGraphs';
import Form from './components/form';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPopUp: false
    };
    this.handleButton = this.handleButton.bind(this);
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