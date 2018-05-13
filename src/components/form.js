import React, { Component } from 'react';

import '../style/formPage.css';

class Form extends Component {
    constructor(props) {
        super(props);
        this.state={
            token: "",
            expire: "",
            capacity: "",
            price: "",
            type: ""

        };
        this.handleFormIssue = this.handleFormIssue.bind(this);
        this.handleInputs = this.handleInputs.bind(this);
    };

handleFormIssue(event) {
    event.preventDefault();
    this.props.handleClose();
    console.log(this.state);

};

handleInputs(event) {
    console.log(event.target.id);
    switch(event.target.id) {
      case "inputToken": this.setState({token: event.target.value})
      break;
      case "inputExpire": this.setState({expire: event.target.value})
      break;
      case "inputCapacity": this.setState({capacity: event.target.value})
      break;
      case "inputPrice": this.setState({price: event.target.value})
      break;
      case "inputType": this.setState({type: event.target.value})
      break;
      default: 0;
  }  
};

render() {
    return (
        <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <form className="formPage" onSubmit={this.handleFormIssue}>
            <button className="btn btn-light" style={{display: "inline-block", marginLeft: "90%", width: "2rem"}} onClick={this.props.handleClose}>X</button>
                <div className="form-row">
                    <div className="form-group col-md-12">
                        <label>Token</label>
                        <input 
                            type="token"
                            value={this.state.token}
                            className="form-control" 
                            id="inputToken" 
                            placeholder="Token" 
                            onChange={this.handleInputs}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-12">
                        <label>Expire</label>
                        <input 
                            type="expire"
                            value={this.state.expire}
                            className="form-control" 
                            id="inputExpire" 
                            placeholder="Expire" 
                            onChange={this.handleInputs}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-12">
                        <label>Capacity</label>
                        <input 
                            type="capacity"
                            value={this.state.capacity}
                            className="form-control" 
                            id="inputCapacity" 
                            placeholder="Capacity" 
                            onChange={this.handleInputs}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-12">
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
                <div className="form-row">
                    <div className="form-group col-md-12">
                        <label>Type</label>
                        <input 
                            type="price"
                            value={this.state.type}
                            className="form-control" 
                            id="inputType" 
                            placeholder="Type" 
                            onChange={this.handleInputs}
                        />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Sign in</button>
            </form>
        </div>
        );
    };
};

export default Form;
