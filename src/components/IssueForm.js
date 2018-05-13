import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux'


class IssueForm extends Component {
  constructor(props) {
    super(props);
    console.log("props:", props);
    const { handleSubmit, pristine, reset, submitting, formState } = props;
    this.handleSubmit = handleSubmit;
    this.formState = formState;
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
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
            <label>ETH reserve</label>
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
            <label>AlphaPoint Ooffer price</label>
            <div>
              <Field
                name="price"
                component="input"
                type="text"
                placeholder="AlphaPoint price"
              />
            </div>
          </div>          
          <br />
          <div>
            <RaisedButton type="submit" label="Submit" />
          </div>
        </div>
      </form>
        )
      }
    }
    
    

let Form = reduxForm({
  form: 'issue'
})(IssueForm);

Form = connect(
  (state, ownProps) => ({
    initialValues: {
      amount: 10,
      reserve: 0.015395
    },
    formState: state.form.issue
  }),
)(Form);


export default Form;
