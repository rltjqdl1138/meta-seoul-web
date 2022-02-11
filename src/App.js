import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React  from 'react';
import ExploreContainer from './Container/ExploreContainer'
import HeaderContainer from './Container/HeaderContainer';
import LoginContainer from './Container/LoginContainer'


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
            <div className="App">
                <HeaderContainer
                    setLoginModal={this.setLoginModal}
                />
                <div style={{overflowY: this.state.isDisableLoginModal ? '' : 'hidden'}}>
                    <ExploreContainer />
                    <LoginContainer
                        isDisableLoginModal={this.state.isDisableLoginModal}
                        SetState={this.SetState}
                        setLoginModal={this.setLoginModal}
                    />
                </div>
            </div>
        );
    }
}


export default App;
