import React from 'react';

import '../style/profiles.css';

import Writer from './writer/writer';
import Buyer from './buyer/buyer';

const Profiles = (props) => {
    return (
        <section className="row no-gutters profiles">
            <Writer 
                handleButton={props.handleButton}
                writerOptionList={props.writerOptionList}
                handleDelivery={props.handleDelivery}
            />
            {/* <Buyer /> */}
        </section>
    );
};

export default Profiles;
