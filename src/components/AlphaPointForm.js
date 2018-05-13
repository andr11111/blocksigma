import React from 'react'
import {Field, reduxForm} from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton';


const AlphaPointForm = props => {
  const {handleSubmit, pristine, reset, submitting} = props
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Offer on AlphaPoint</label>
        <div>
          <Field
            name="Price"
            component="input"
            type="text"
            placeholder="Price"
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
  form: 'alphaPoint'
})(AlphaPointForm)