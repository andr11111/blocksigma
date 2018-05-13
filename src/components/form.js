import React, { Component } from 'react';

import '../style/formPage.css';

class Form extends Component {
    constructor(props) {
        super(props);
        this.state={
            capacity: "",
            price: ""
        };
        this.handleFormIssue = this.handleFormIssue.bind(this);
    };

handleFormIssue(event) {
    event.preventDefault();
    console.log(event);
};

handleInputs(event) {
  console.log(event.name);
    switch(event.name) {
      case "capacity": this.setState({capacity: event.target.value})
      break;
      case "price": this.setState({capacity: event.target.value})
      break;
      default: 0;
  }  
};

render() {
    return (
        <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <form className="formPage" onSubmit={this.handleFormIssue}>
            <button className="btn btn-light" style={{display: "inline-block", marginLeft: "90%", width: "2rem"}} onClick={props.handleClose}>X</button>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label>Price</label>
                        <input 
                            type="price"
                            value={this.state.price}
                            className="form-control" 
                            id="inputPrice" 
                            placeholder="Price" 
                            onChange={this.handleInputs}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label>Capacity</label>
                    <input 
                        type="text"
                        value={this.state.capacity}
                        className="form-control" 
                        id="inputCapacity" 
                        placeholder="Capacity"
                        onChange={this.handleInputs}
                    />
                </div>
                <div className="form-group">
                    <label>Type</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="inputType" 
                        placeholder="type" 
                    />
                </div>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label>City</label>
                        <input type="text" className="form-control" id="inputCity" />
                    </div>
                    <div className="form-group col-md-2">
                        <label>Zip</label>
                        <input type="text" className="form-control" id="inputZip" />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Sign in</button>
            </form>
        </div>
        );
    };
};

export default Form;
