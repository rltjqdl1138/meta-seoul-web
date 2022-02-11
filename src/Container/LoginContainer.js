import React, { StyleSheet, useRef, useEffect, useState } from 'react';


class LoginContainer extends React.Component{
    constructor(props){
        super(props)
    }
    test = async ()=>{
        if(typeof window.ethereum !== undefined){
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            console.log(account)
            //const nonce = tempNonce(user.nonce)
            //let sign = await window.web3.eth.personal.sign( nonce, account, "")

            this.props.SetState('auth',{isLogined: true, address:account})
            this.props.setLoginModal(false)
        }
    }
    render(){
        const {isDisableLoginModal, setLoginModal} = this.props
        return isDisableLoginModal ? null :
            (
                <div className="hover" style={styles.container} >
                    
                    <div style={styles.background} className="hovered" onClick={()=>setLoginModal(false)} />
                    <div style={styles.loginContainer}>
                        <div style={styles.metamaskButtonContainer}>
                            <div className="hovered" style={styles.metamaskButton} onClick={()=>this.test()}>

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
        opacity:0.2,
        backgroundColor:'black',
    },
    loginContainer:{
        position:'fixed',
        width:400,
        height:400,
        top: 200,
        left: "50%",
        marginLeft:-200,
        backgroundColor:'#ffffff',
        display:'flex'
    },
    metamaskButtonContainer:{
        width:'100%',
        height:50,
        margin:"auto",
        background:'yellow',
        padding:0,
    },
    metamaskButton:{
        width:200,
        height:'100%',
        backgroundColor:'gray'
    }
}


export default LoginContainer