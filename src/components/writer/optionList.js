import React from 'react';

import Option from './option';
import '../../style/optionList.css';

const optionList = (props) => {
    return (
        <div className="col col-sm-10 optionList" style={{padding: "0.5rem"}}>
            <div className="row no-gutters">
                <div className="col col-sm-12 headerList">
                    <h3>My Portfolio</h3>
                </div>
            </div>
            <div className="row no-gutters">
                <div className="col col-sm-9 headerTable">
                    <table className="table" style={{margin: "0", color: "rgb(100,170,193)", fontSize: "12px"}}>
                    <thead>
                    <tr>
                        <th scope="col">Token</th>
                        <th scope="col">Strike</th>
                        <th scope="col">Expiration</th>
                        <th scope="col">Put/Call</th>
                        <th scope="col">Reserve</th>
                    </tr>
                    </thead>
                    </table>
                </div> 
                <div className="col col-sm-3"> </div>
            </div>
            <div className="row no-gutters">
                <div className="col col-sm-12 tableBody">
                    <table className="table">
                        <tbody>
                        {props.writerOptionList.map((elem, i) => {
                            if (Object.values(elem).length > 0) {
                                return (
                                    <Option 
                                        content={elem}
                                        id={i}
                                        key={i}
                                        handleDelivery={props.handleDelivery}
                                    />
                                )
                            } 
                        })
                    }
                        </tbody>
                    </table>
                </div>
            </div> 
        </div> 
    );
};

export default optionList;