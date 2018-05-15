import React from 'react';

import '../../style/belowPaO.css';
import wallet from '../../assets/wallet.svg';

const BelowPaO = ({handleButton}) => {
    return (
        <div className="row no-gutters belowPaO align-items-center">
            <div className="col col-mb-2 iconWallet">
                <img className="wallet" src={wallet} alt="wallet"/>
            </div>
            <div className="col col-mb-3 portfolioLine">
                <h6>Portfolio</h6>
            </div>
            <div className="col col-mb-2 iconWallet">
                <img className="wallet" src={wallet} alt="wallet"/>
            </div>
            <div className="col col-mb-2 portfolioLineTrans">
                <h6>Transaction</h6>
            </div>
            <div className="col col-mb-3">
                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal" onClick={handleButton}>NEW OPTION</button>
            </div>
        </div> 
    );
};

export default BelowPaO;