import React, { Component } from 'react';
import IssueForm from './IssueForm';
import AlphaPointForm from './AlphaPointForm';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';


class Home extends Component {
  state = {
    openIssue: false,
    openAlpha: false,
  };

  constructor(props) {
    super(props);
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
  
  issueOption = (data) => {
    console.log("Issue option:", data);
    this.handleCloseIssue();
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
                <CardText>
                  Writer of an option has theoretically unlimited risk. They need to post maintenance margin to cover the outstanding liability. Writer continuously monitors and updates the reserve to be above requirement, otherwise they risk losing the reserve due to liquidation.
                </CardText>
                <CardActions>
                  <FlatButton label="Issue Option Contracts" onClick={this.handleOpenIssue} />
                  <FlatButton label="Offer on AlphaPoint" style = {{width: 200}} />
                  <FlatButton label="Deliver" />
                </CardActions>
              </Card>              
            </td>
            <td style={{width: '50%'}}>
              <Card style={{height: '400px'}}>
                <CardTitle title="Buyer" />
                <CardText>
                  Buyer's risk is limited to the initial premium paid. However, buyer has to continuously monitor the reserve and force liquidation of the position whenever it goes below the requirement.
                </CardText>
                <CardActions>
                  <FlatButton label="Purchase Option Contracts" />
                  <FlatButton label="Exercise" />
                  <FlatButton label="Force liquidate" style = {{width: 200}} />
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
      </div>
    );  
  };
}

export default Home;