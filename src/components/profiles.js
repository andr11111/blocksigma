import React from 'react';

import '../style/profiles.css';

import Writer from './writer/writer';
import Buyer from './buyer/buyer';

const Profiles = (props) => {
    return (
        <section className="row no-gutters profiles">
            <Writer 
                handleButton={props.handleButton}
            />
            <Writer 
                handleButton={props.handleButton}
            />
            {/* <Buyer /> */}
        </section>
    );
};

export default Profiles;
