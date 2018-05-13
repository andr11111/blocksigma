import React from 'react'
import {Field, reduxForm} from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton';


const OptionForm = props => {
  const {handleSubmit, pristine, reset, submitting} = props
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Base Token address</label>
        <div>
          <Field
            name="baseTokenAddress"
            component="input"
            type="text"
            placeholder="Base Token address"
          />
        </div>
      </div>
      <div>
        <label>Strike</label>
        <div>
          <Field
            name="strike"
            component="input"
            type="text"
            placeholder="Strike"
          />
        </div>
      </div>
      <div>
        <label>Expiration</label>
        <div>
          <Field
            name="expiration"
            component="input"
            type="text"
            placeholder="Expiration"
          />
        </div>
      </div>
      <div>
        <label>Type</label>
        <div>
          <label>
            <Field name="isPut" component="input" type="radio" value="0" />
            {' '}
            Call
          </label>
          <label>
            <Field name="isPut" component="input" type="radio" value="1" />
            {' '}
            Put
          </label>
        </div>
      </div>
      <div>
        <label>Required reserve</label>
        <div>
          <Field
            name="reserve"
            component="input"
            type="text"
            placeholder="Required reserve"
          />
        </div>
      </div>
      <div>
        <label>Bancor converter address</label>
        <div>
          <Field
            name="bancorConverter"
            component="input"
            type="text"
            placeholder="Bancor converter address"
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
  form: 'option'
})(OptionForm)