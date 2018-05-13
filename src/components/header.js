import React from 'react';

import '../style/header.css';
import logo from '../assets/sigma.png';

const Header = (props) => {
    return  (
        <header className="row justify-content-center">
            <div className="col col-sm-12 header">
                <div className="row justify-content-between"> 
                    <div className="col col-sm-2 logo"> 
                        <img  src={logo} alt="logo" />
                    </div>
                    <div className="login">
                        <button type="button" className="btn btn-success">Login</button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;