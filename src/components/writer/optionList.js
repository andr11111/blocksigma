import React from 'react';

import Option from './option';
import '../../style/optionList.css';

const optionList = (props) => {
    console.log(props);
    return (
        <div className="col col-sm-10 optionList" style={{padding: "0.5rem"}}>
            <div className="row no-gutters">
                <div className="col col-sm-12 headerList">
                    <h3>My Portfolio</h3>
                </div>
            </div>
            <div className="row no-gutters">
                <div className="col col-sm-10 headerTable">
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
            </div>
            <div className="row no-gutters">
                <div className="col col-sm-12 tableBody">
                    <table className="table">
                        <tbody>
                        {props.writerOptionList.map((elem, i) => {
                            console.log(elem);
                            return (
                                <Option 
                                    content={elem}
                                    key={i}
                                />
                                )
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