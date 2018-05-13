import React, { Component } from 'react';
import {Field, reduxForm} from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton';

import { contractAPI, web3 } from "../api";
const API_URL = "http://localhost:7545";
const ADDRESS = "0x53DE0dbe22F953F849EF7A79f5ca792129414f59";
const GAS = 1000000;
const Web3 = require('web3');



class Home extends Component {
  constructor(props) {
    super(props);
    const {handleSubmit, pristine, reset, submitting} = props;
    this.handleSubmit = handleSubmit;

    contractAPI(API_URL).then((web3API) => {
      this.web3API = web3API;
    }).catch((e) => {
      console.error("Error:", e.message);
    });    
  };

  async getRequiredReserve() {
    const result = await this.web3API.issue(10, {
      from: ADDRESS,
      value: 15395000000000000, // 0.015395 ETH
      gas: GAS
    });
    console.log("result = ", result);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label>Contract configuration: <b>EOS May 31 2018 0.02 ETH Call</b></label>
        </div>      
        <div>
          <label>Number of contracts</label>
          <div>
            <Field
              name="amount"
              component="input"
              type="text"
              placeholder="Number of contracts"
            />
          </div>
        </div>
        <br />
        <div>
          <label>ETH Reserve</label>
          <div>
            <Field
              name="reserve"
              component="input"
              type="text"
              placeholder="ETH Reserve"
            />
          </div>
        </div>
        <br />
        <div>
          <RaisedButton type="submit" label="Submit" />
        </div>
      </form>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  formState: state.form.myForm,  // <== Inject the form store itself
});

export default reduxForm({
  form: 'issue'
})(IssueForm)