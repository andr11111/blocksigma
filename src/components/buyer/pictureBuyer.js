import React from 'react';

import icon from '../../assets/icon.png';

const PictureBuyer = () => {
    return (
        <div className="col col-sm-4 pictureAndOptions">
            <div className="row no-gutters">
                <div className="col col-sm-12 icon">
                    <img className="iconPic" src={icon} alt="photo" />
                </div>
            </div>
        </div>
    );
};

export default PictureBuyer;