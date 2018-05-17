import React, { Component } from 'react';
import IssueForm from './IssueForm';
import AlphaPointForm from './AlphaPointForm';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';


import { contractAPI, web3 } from "../api";
const API_URL = "http://localhost:7545";
const ADDRESS = "0x53DE0dbe22F953F849EF7A79f5ca792129414f59";
const GAS = 1000000;
const Web3 = require('web3');

const wsRequestObject = (name, data) => {
  let requestObject = {
    m: 0,
    i: 0,
    n: name,
    o: JSON.stringify(data)
  }

  return JSON.stringify(requestObject);
}

class Home extends Component {
  state = {
    openIssue: false,
    openAlpha: false,
    openSnack: false
  };

  constructor(props) {
    super(props);

    contractAPI(API_URL).then((web3API) => {
      this.web3API = web3API;
    }).catch((e) => {
      console.error("Error:", e.message);
    });

		this.alphapointSocket = new WebSocket("wss://api_demo.alphapoint.com/wsgateway");
		
		this.alphapointSocket.onmessage = function(event) {
			const eventData = JSON.parse(event.data);
			const responseObject = JSON.parse(eventData.o);
			switch(eventData.n) {
				case "WebAuthenticateUser": {
					console.log("auth response");
					break;
				}
				case "GetOpenOrders": {
					// update UI as needed
					console.log("total orders: ", responseObject.length);
					responseObject.forEach(el => {
						console.log("importand data: ", el.Side, el.Price, el.Quantity);
					})

					break;
				}
				case "SendOrder": {
					console.log("submitted")
					// update UI as needed
					break;
				}
				default: {
					console.log("default, not used");
				}

			}
		};

		let loginCreds = {
			UserName: "blocksigma",
			Password: "8base"
		};


		this.alphapointSocket.onopen = (event) => {
		  this.alphapointSocket.send(wsRequestObject("WebAuthenticateUser", loginCreds)); 
		};    
  };
  

  handleOpenIssue = () => {
    this.setState({openIssue: true});
  };

  handleCloseIssue = () => {
    this.setState({openIssue: false});
  };


  handleOpenAlpha = () => {
    this.setState({openAlpha: true});
  };

  handleCloseAlpha = () => {
    this.setState({openAlpha: false});
  };

  handleSnackOpen = () => {
    this.setState({openSnack: true});
  };

  handleSnackClose = () => {
    this.setState({
      openSnack: false,
    });
  };
  
  issueOption = async (data) => {
    console.log("Issue option:", data);
    const result = await this.web3API.issue(data.amount, {
      from: ADDRESS,
      value: Web3.utils.toWei(String(data.reserve), "ether"), // 0.015395 ETH
      gas: GAS
    });
    console.log("result = ", result);
    
    this.offerOnAlphaPoint({price: data.price, quantity: data.amount});

    this.handleCloseIssue();
    this.handleSnackOpen();
  }

  offerOnAlphaPoint = async (data) => {
    console.log("data:", data);
		const price = data.price;
		const quantity = data.quantity;
		const submitNewOrderRequest = {
			AccountId: 116,
			ClientOrderId: 0,
			Side: 0,
			Quantity: quantity,
			OrderIdOCO: 0,
			OrderType: 2,
			InstrumentId: 10,
			TimeInForce: 0,
			OMSId: 1,
			UseDisplayQuantity: false,
			LimitPrice: price
		}

		this.alphapointSocket.send(wsRequestObject("SendOrder", submitNewOrderRequest));
    
    // this.handleCloseAlpha();
    // this.handleSnackOpen();
  }  

  exerciseOption = async (data) => {
    console.log("exercise option:", data);
    const result = await this.web3API.exercise({
      from: ADDRESS,
      value: Web3.utils.toWei("0.2", "ether"),
      gas: GAS
    });    
    console.log("result = ", result);
      
    this.handleSnackOpen();
  }

  deliverOption = async (data) => {
    console.log("deliver option:", data);
    const result = await this.web3API.deliver(ADDRESS, {
      from: ADDRESS,
      gas: GAS
    });
    console.log("result = ", result);
      
    this.handleSnackOpen();
  }

  liquidateOption = async (data) => {
    console.log("liquidate option:", data);
    const result = await this.web3API.forceLiquidation({
      from: ADDRESS,
      gas: GAS
    });
    console.log("result = ", result);
      
    this.handleSnackOpen();
  }  


  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleCloseIssue}
      />,
    ];
    
    
    return (
      <div>
        <AppBar
        title="BlockSigma"
        iconClassNameRight="muidocs-icon-navigation-expand-more"
        />
        <table>
          <tr>
            <td style={{width: '50%'}}>
              <Card style={{height: '400px'}}>
                <CardTitle title="Writer" />
                <CardText style={{height: '150px'}}>
                  Writer of an option has theoretically unlimited risk. They need to post maintenance margin to cover the outstanding liability. Writer continuously monitors and updates the reserve to be above requirement, otherwise they risk losing the reserve due to forced liquidation.
                </CardText>
                <CardActions>
                  <FlatButton label="Issue Option Contracts" onClick={this.handleOpenIssue} />                  
                  <FlatButton label="Deliver" onClick={this.deliverOption}/>
                </CardActions>
              </Card>              
            </td>
            <td style={{width: '50%'}}>
              <Card style={{height: '400px'}}>
                <CardTitle title="Buyer" />
                <CardText style={{height: '150px'}}>
                  Buyer's risk is limited to the initial premium paid. However, buyer has to continuously monitor the reserve and force liquidation of the position whenever it goes below the requirement.
                </CardText>
                <CardActions>                  
                  <FlatButton label="Exercise" onClick={this.exerciseOption} />
                  <FlatButton label="Force liquidate" onClick={this.liquidateOption} style = {{width: 200}} />
                </CardActions>
              </Card>
            </td>
          </tr>
        </table>
        <Dialog
          title="Issue Option Contracts"
          actions={actions}
          modal={true}
          open={this.state.openIssue}
        >
          <IssueForm onSubmit={this.issueOption}/>
        </Dialog>       
        <Dialog
          title="Offer on AlphaPoint"
          actions={actions}
          modal={true}
          open={this.state.openAlpha}
        >
          <AlphaPointForm onSubmit={this.offerOnAlphaPoint}/>
        </Dialog>          

        <Snackbar
          open={this.state.openSnack}
          message="Submitted"
          autoHideDuration={4000}
          onRequestClose={this.handleSnackClose}
        />           
      </div>
    );  
  };
}

export default Home;