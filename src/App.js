import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useRef, useEffect, useState } from 'react';
import ExploreContainer from './Container/ExploreContainer'
import HeaderContainer from './Container/HeaderContainer';
import LoginContainer from './Container/LoginContainer'
function App() {
    useEffect(() => {

    });
    return (
        <div className="App">
            <HeaderContainer />
            <ExploreContainer />
        </div>
    );
}


export default App;
