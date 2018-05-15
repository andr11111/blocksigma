import React from 'react';

import '../../style/option.css';

const Option = (props) => {
    console.log(props.id);
    return (    
        <div className="row no-gutters">
            <div className="col col-sm-9 option">
                <td>{props.content.token}</td>
                <td>{props.content.price}</td>
                <td>{props.content.expire}</td>
                <td>{props.content.type}</td>
                <td>{props.content.capacity}</td>
            </div>
            <div className="col col-sm-3 buttonsBlock">
                <button id={props.id} className="btn btn-primary" style={{display: "inline-block", width: "42%", margin: "0rem 0.2rem"}} onClick={props.handleDelivery}>Deliver</button>
                <button id={props.id} className="btn btn-info"  style={{display: "inline-block", width: "42%", margin: "0rem 0.2rem"}} onClick={props.handleDelivery}>Liquidate</button>
            </div>
        </div>
    );
};

export default Option;