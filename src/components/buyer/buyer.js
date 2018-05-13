import React from 'react';

import OptionListBuyer from './optionListBuyer';
import PictureBuyer from './pictureBuyer';

const Buyer = () => {
    return (
        <div className="col col-sm-6 writer">
            <div className="row no-gutters">
                <PictureBuyer />
                <OptionListBuyer />
            </div>
        </div>
    );
};

export default Buyer;