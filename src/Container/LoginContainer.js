import React, { StyleSheet, useRef, useEffect, useState } from 'react';

import axios from 'axios'

class LoginContainer extends React.Component{
    constructor(props){
        super(props)
    }
    test = async ()=>{
        if(typeof window.ethereum !== undefined){
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            
            let nonce = "asdfasdf"
            let sign = await window.web3.eth.personal.sign( nonce, account, "")
            const {data} = await axios.post('/v1/auth/metamask?sign='+sign)

            const accessToken = data.access_token

            this.props.setProps('auth',{isLogined: true, address:account, accessToken})
            this.props.setLoginModal(false)
        }
    }
    render(){
        const {isDisableLoginModal, setLoginModal} = this.props
        return isDisableLoginModal ? null :
            (
                <div style={styles.container} >
                    
                    <div style={styles.background} className="hovered" onClick={()=>setLoginModal(false)} />
                    <div style={styles.loginContainer}>
                        <div style={styles.loginTextContainer}>
                            <div style={styles.loginTitleContainer}>
                                Sign in
                            </div>
                            <div style={styles.loginContentContainer}>
                                You can log in only with MetaMask
                            </div>
                        </div>
                        <div style={styles.metamaskButtonContainer}>
                            <div className="hovered" style={styles.metamaskButton} onClick={()=>this.test()}>
                                <div style={styles.metamaskImageContainer}>
                                    <img style={styles.metamaskImage} src="/metamask.png" />
                                </div>
                                <div>
                                    <div style={styles.metamaskTitle}>
                                        MetaMask
                                    </div>
                                    <div style={styles.metamaskContent}>
                                        Login or Sign up
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
    }
}

const styles = {
    container:{
        position:'absolute',
        top:0,
        left:0,
        width:'100%',
        height:'100%',
    },
    background:{
        position:'fixed',
        top:0,
        left:0,
        width:'100%',
        height:'100%',
        opacity:0.8,
        backgroundColor:'#29292c',
    },
    loginContainer:{
        position:'fixed',
        width:480,
        height:250,
        top: "50%",
        left: "50%",
        marginTop:-125,
        marginLeft:-240,
        backgroundColor:'#edf0ff',
        display:'flex',
        flexDirection:'column',

        paddingTop:40,
        paddingBottom:40
    },
    loginTextContainer:{
        flex:1,
        width:'100%',
    },
    loginTitleContainer:{
        fontSize:24,
        color:'#1d1e54',
        textAlign:'center'
    },
    loginContentContainer:{
        fontSize:14,
        color:'#7e7e7e',
        textAlign:'center'
    },


    metamaskButtonContainer:{
        flex:1,
        width:'100%',
        margin:"auto",
        padding:0,
        display:'flex'
    },
    metamaskButton:{
        margin:"auto",
        width:280,
        height:86,
        paddingTop:10,
        paddingBottom:10,
        
        backgroundColor:'#fff',
        border: '2px solid #dfe0e4',
        display:'flex'
    },
    metamaskImageContainer:{
      marginTop:10,
        height:'100%',
        width:40,
        marginLeft:20,
        marginRight:20
    },
    metamaskImage:{
        height:40
    },
    metamaskTitle:{
        textAlign:'left',
        fontSize:22
    },
    metamaskContent:{
        textAlign:'left',
        fontSize:14
    }
}


export default LoginContainer