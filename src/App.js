import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React  from 'react';
import HeaderContainer from './Container/HeaderContainer';
import LoginContainer from './Container/LoginContainer'
import ExploreContainer from './Container/ExploreContainer'
import UploadContainer from './Container/UploadContainer'
import TestContainer from './Container/TestContainer';
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
    setLoginModal = (value)=>{
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
                            <Route index element={<TestContainer />} />
                            <Route path="1" element={<ExploreContainer />} />
                            <Route path="2" element={<TestContainer auth={this.state.auth}/>} />
                            <Route path="3" element={<TestContainer auth={this.state.auth}/>}/>
                        </Route>
                    </Routes>
                    {this.state.isDisableLoginModal ? null : (<LoginContainer setProps={this.SetState} setLoginModal={this.setLoginModal}/>)}
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
