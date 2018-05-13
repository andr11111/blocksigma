import React from 'react'
import {Field, reduxForm} from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux'


const AlphaPointForm = props => {
  const {handleSubmit, pristine, reset, submitting} = props
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Offer on AlphaPoint</label>
        <div>
          <Field
            name="price"
            component="input"
            type="text"
            placeholder="Price"
          />
        </div>
      </div>
      <br />
      <div>
        <label>Quantity</label>
        <div>
          <Field
            name="quantity"
            component="input"
            type="text"
            placeholder="Quantity"
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


let Form = reduxForm({
  form: 'alphaPoint'
})(AlphaPointForm);

Form = connect(
  (state, ownProps) => ({
    initialValues: {
      price: 3,
      quantity: 10
    },
    formState: state.form.issue
  }),
)(Form);


export default Form;