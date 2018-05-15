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
            type: "",
            isShown: false
        };
        this.handleFormIssue = this.handleFormIssue.bind(this);
        this.handleInputs = this.handleInputs.bind(this);
    };

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.isPopUp !== this.state.isShown) {
            this.setState({
                isShown: nextProps.isPopUp
            });
        }
    };

    handleFormIssue(event) {
        event.preventDefault();
        this.props.handleNewIssue(this.state);
        this.setState({
            token: "",
            expire: "",
            capacity: "",
            price: "",
            type: "",
        });
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
    return this.state.isShown ? 
        <div className="modal fade shown show" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{paddingRight: "0px", display: "block"}}>
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
                <button type="submit" className="btn btn-primary" style={{margin: "0 auto"}}>Sign in</button>
            </form>
        </div>
    : <div style={{display: "none"}}> </div>
    };

// componentDidUpdate(nextProps, nextState) {
//     console.log(nextProps, this.state.isShown);
//         if (nextProps.isPopUp !== this.state.isShown) {
//             this.setState({
//                 isShown: nextProps.isPopUp
//             })
//         }
//     };
};

export default Form;
