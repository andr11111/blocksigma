import React from 'react'
import {Field, reduxForm} from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton';


const IssueForm = props => {
  const {handleSubmit, pristine, reset, submitting} = props
  return (
    <form onSubmit={handleSubmit}>
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
      <div>
        <RaisedButton type="submit" label="Submit" />
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'issue'
})(IssueForm)