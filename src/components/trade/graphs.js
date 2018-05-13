import React from 'react';

import Chart1 from '../../assets/walmart-chart.png';
import Chart2 from '../../assets/walmart-sales.png';

import '../../style/graphs.css';

const Graphs = () => {
    return (
        <div className="col col-sm-4 graphs">
            <img id='first' src={Chart1} alt="chart1"/>
            <img id='second' src={Chart2} alt="chart2"/>
        </div>
    );
};

export default Graphs;