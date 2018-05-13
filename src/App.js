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
    this.handleNewIssue = this.handleNewIssue.bind(this);

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

  render() {
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
  };
};

export default App;