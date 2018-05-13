import React from 'react';

import '../../style/belowPaO.css';
import wallet from '../../assets/wallet.svg';

const BelowPaO = (props) => {
    return (
        <div className="row no-gutters belowPaO align-items-center" style={{margin: "0"}}>
            <div className="col col-sm-1 iconWallet">
                <img className="wallet" src={wallet} alt="wallet"/>
            </div>
            <div className="col col-sm-2 portfolioLine">
                <h6>Portfolio</h6>
            </div>
            <div className="col col-sm-1 iconWallet">
                <img className="wallet" src={wallet} alt="wallet"/>
            </div>
            <div className="col col-sm-2 portfolioLineTrans">
                <h6>Transaction</h6>
            </div>
            <div className="col col-sm-2">
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" onClick={props.handleButton}>NEW OPTION</button>
            </div>
        </div> 
    );
};

export default BelowPaO;