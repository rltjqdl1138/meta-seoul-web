import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React  from 'react';
import HeaderContainer from './Container/HeaderContainer';
import LoginContainer from './Container/LoginContainer'
import ExploreContainer from './Container/ExploreContainer'
import UploadContainer from './Container/UploadContainer'

import { BrowserRouter, Routes, Route } from 'react-router-dom';

class App extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            auth:{
                isLogined:false,
                address:''
            },
            isDisableLoginModal:true
        }
    }
    SetState = (field, value)=> this.setState( state =>({ ...state, [field]:value } ))
    
    setLoginModal = (value) => {
        const disable =  value ? false : true
        this.SetState('isDisableLoginModal', disable)
    }
    
    render(){
        return (
            <div className="app">
                <BrowserRouter>
                    <HeaderContainer
                        auth={this.state.auth}
                        setLoginModal={this.setLoginModal}
                    />
                    <Routes>
                        <Route path="/">
                            <Route index element={<div />} />
                            <Route path="1" element={<div />} />
                            <Route path="2" element={<UploadContainer />} />
                            <Route path="3" element={<div />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
                
            </div>
        );
    }
}

/*
<div className="App">
<HeaderContainer
    auth={this.state.auth}
    setLoginModal={this.setLoginModal}
/>
<MainPageContainer />
<div style={{overflowY: this.state.isDisableLoginModal ? '' : 'hidden'}}>

    <LoginContainer
        auth={this.state.auth}
        isDisableLoginModal={this.state.isDisableLoginModal}
        SetState={this.SetState}
        setLoginModal={this.setLoginModal}
    />
</div>
</div>*/

export default App;
