import React from 'react';

import icon from '../../assets/Leonard@2x.png';
import shape from '../../assets/Shape.svg';
import '../../style/pictureAndOption.css';

const PictireAndOption = (props) => {
    return (
        <div className="row pictureAndOptions justify-content-between" style={{margin: "0"}}>
            <div className="col col-sm-1 fancyIcon">
                <img id="shape" src={shape} alt="shape" />
            </div>
            <div className="col col-sm-4 smallLogo">
                SIGMA
            </div>
            <div className="col col-sm-5 nameAndArrow">
                <img className="iconPic" src={icon} alt="photo" />
                <span className="textName">Garry Casparov</span>
            </div>
        </div> 
    );
};

export default PictireAndOption;