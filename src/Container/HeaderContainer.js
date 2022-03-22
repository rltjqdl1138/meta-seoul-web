
import React from 'react';
import { Link } from 'react-router-dom';

function HeaderContainer({setLoginModal, auth}){
    return (
        <div style={styles.container}>
            <Link to="">
                <div className="hovered" style={styles.logoContainer}>
                    <img style={styles.logoImage} src="/logo.png"/>
                </div>
            </Link>
            <nav className="nav-container" style={styles.navContainer}>
                <Link to="1">
                    <div className="hovered" style={styles.navItemContainer} >
                        <div className="font-poppins" style={styles.navItemText}>
                            Buy Land
                        </div>
                    </div>
                </Link>
                <Link to="2">
                    <div className="hovered" style={styles.navItemContainer}>
                        <div className="font-poppins" style={styles.navItemText}>
                          Marketplace
                        </div>
                    </div>
                </Link>
                <Link to="3">
                    <div className="hovered" style={styles.navItemContainer}>
                        <div className="font-poppins" style={styles.navItemText}> 
                            View NFTs
                        </div>
                    </div>
                </Link>
                <Link to="4">
                    <div className="hovered" style={styles.navItemContainer}>
                        <div className="font-poppins" style={styles.navItemText}>
                            My NFT
                        </div>
                    </div>
                </Link>
                <Link to="5">
                    <div className="hovered" style={styles.navItemContainer}>
                        <div className="font-poppins" style={styles.navItemText}>
                            Support
                        </div>
                    </div>
                </Link>
            </nav>

            {
                auth.isLogined ?
                (<div style={styles.loginContainer}>
                    <div style={styles.profileContainer}>
                        <img style={styles.profileImage} src="/profile.png" />
                    </div>
                </div>) :
                (<div style={styles.loginContainer}>
                    <div onClick={()=>setLoginModal(true)}
                        className="hovered"
                        style={styles.loginButton}>
                        Login
                    </div>
                </div>)
            }

            {/*
            <div className="hovered" style={styles.menuboxContainer}>
                <div style={{...styles.menuboxIconBox, marginBottom:6}} />
                <div style={{...styles.menuboxIconBox, marginTop:6, marginBottom:6}} />
                <div style={{...styles.menuboxIconBox, marginTop:6 }}/>
            </div>
            */}
        </div>
    )
}

const styles = {
    container:{
        height: 66,
        width:'100%',
        display: 'flex',
        paddingLeft:33,
        paddingRight:33
    },
    logoContainer:{
        width:205,
        height:'100%',
        marginRight:33,
    },
    logoImage:{
        width:205,
        marginTop:20,
    },
    navContainer:{
        flex:1,
        textAlign:'center',
        margin:0

    },
    navItemContainer:{
        width:120,
        height:'100%',
        display:'inline-block',
        paddingTop:20,
        paddingBottom:10
    },
    navItemText:{
        height:20,
        fontFamily:'Poppins-Regular',
        fontSize:13,
        display:'inline-block',
        verticalAlign:'center',
        color:'#000'
    },
    navItemImage:{
        width:10,
        height:20,
        marginLeft:7,
        marginRight:7,
        paddingTop:8,
        paddingBottom:8,
        display:'inline-block',
        verticalAlign:'center'
    },

    loginContainer:{
        width:90,
        height:42,
        marginLeft:35,
        display:'flex',
        marginTop:10,

    },
    loginButton:{
        height:32,
        width:90,
        backgroundColor:"#405ca9",
        fontFamily:'Poppins-Medium',
        color:'#ffffff',
        fontSize:14,
        borderRadius:16,
        paddingTop:5,
        paddingBottom:5,
        margin: 'auto',
        marginTop:8,
        textAlign:'center'
    },
    profileContainer:{
        flex:1
    },
    profileImage:{
        width:42,
        height:'100%'
    },
    menuboxContainer:{
        height:22,
        width:28,
        marginTop:15
    },
    menuboxIconBox:{
        width:'100%',
        height:4,
        backgroundColor:"#405ca9",
    }
}

export default HeaderContainer