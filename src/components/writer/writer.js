import React from 'react';

import PictureAndOption from './pictureAndOption';
import OptionListWriter from './optionList';
import BelowPaO from './belowPaO';
import Form from '../form';

const Writer = (props) => {
    return (
        <div className="col col-sm-6 writer">
            <div className="row no-gutters">
                <PictureAndOption />
                <BelowPaO 
                    handleButton={props.handleButton}
                />
                <OptionListWriter />
            </div>
        </div>
    );
};

export default Writer;