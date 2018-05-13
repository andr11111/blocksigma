import React, { Component } from 'react';

import '../style/formPage.css';

class Form extends Component {
    constructor(props) {
        super(props);
        this.state={

        };
        this.handleFormIssue = this.handleFormIssue.bind(this);
    };

handleFormIssue(event) {
    event.preventDefault();
    console.log(event);
};

render() {
    return (
        <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <form className="formPage" onSubmit={this.handleFormIssue}>
            <button className="btn btn-light" style={{display: "inline-block", marginLeft: "90%", width: "2rem"}}>X</button>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label>Email</label>
                        <input type="email" className="form-control" id="inputEmail4" placeholder="Email" />
                    </div>
                    <div className="form-group col-md-6">
                    <label>Password</label>
                    <input type="password" className="form-control" id="inputPassword4" placeholder="Password" />
                    </div>
                </div>
                <div className="form-group">
                    <label>Address</label>
                    <input type="text" className="form-control" id="inputAddress" placeholder="1234 Main St" />
                </div>
                <div className="form-group">
                    <label>Address 2</label>
                    <input type="text" className="form-control" id="inputAddress2" placeholder="Apartment, studio, or floor" />
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
                <div className="form-group">
                    <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="gridCheck" />
                    <label className="form-check-label">
                        Check me out
                    </label>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Sign in</button>
            </form>
        </div>
        );
    };
};

export default Form;
