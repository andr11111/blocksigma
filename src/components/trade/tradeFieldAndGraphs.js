import React, { Component } from 'react';

import TransactionTable from './transactionTable';
import Graphs from './graphs';

import '../../style/transAndGraph.css';

class TradeFieldAndGraphs extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    };

    render() {
        return (
            <div className="row no-gutters transAndGraph">
                <TransactionTable />
                <Graphs />
            </div>
        ); 
    };
};

export default TradeFieldAndGraphs;