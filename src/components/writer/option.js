import React from 'react';

import '../../style/option.css';

const Option = (props) => {
    console.log(props.content);
    return (    
        <tr className="col col-sm-10 option">
            <td scope="row">{props.content.token}</td>
            <td>{props.contentexpire}</td>
            <td>{props.content.capacity}</td>
            <td>{props.content.price}</td>
            <td>{props.content.type}</td>
            <div className="buttonsBlock" style={{margin: "0 auto"}}>
                <button className="btn btn-primary" style={{display: "inline-block", width: "25%", margin: "0rem 0.15rem"}}>Exercise</button>
                <button className="btn btn-info"  style={{display: "inline-block", width: "25%", margin: "0rem 0.15rem"}}>Liquidate</button>
            </div>
        </tr>
    );
};

export default Option;