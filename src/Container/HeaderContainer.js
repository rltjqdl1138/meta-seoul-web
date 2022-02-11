
import React from 'react';

function HeaderContainer({setLoginModal}){
    return (
        <div style={styles.container}>
            <div className="hovered" style={styles.logoContainer}>
                <img style={styles.logoImage} src="/logo.png"/>
            </div>
            <div className="nav-container" style={styles.navContainer}>
                <div className="hovered" style={styles.navItemContainer} >
                    <div style={styles.navItemText}>
                        Buy Land
                    </div>
                    <img style={styles.navItemImage} src="/arrow.png"/>
                </div>
                <div className="hovered" style={styles.navItemContainer}>
                    <div style={styles.navItemText}>
                        Marketplace
                    </div>
                    <img style={styles.navItemImage} src="/arrow.png"/>
                </div>
                <div className="hovered" style={styles.navItemContainer}>
                    <div style={styles.navItemText}>
                        News
                    </div>
                    <img style={styles.navItemImage} src="/arrow.png"/>
                </div>
                <div className="hovered" style={styles.navItemContainer}>
                    <div style={styles.navItemText}>
                        Community
                    </div>
                    <img style={styles.navItemImage} src="/arrow.png"/>
                </div>
                <div className="hovered" style={styles.navItemContainer}>
                    <div style={styles.navItemText}>
                        Support
                    </div>
                    <img style={styles.navItemImage} src="/arrow.png"/>

                </div>
            </div>
            <div style={styles.loginContainer}>
                <div onClick={()=>setLoginModal(true)}
                    className="hovered"
                    style={styles.loginButton}>
                    Login
                </div>
            </div>
            <div className="hovered" style={styles.menuboxContainer}>
                <div style={{...styles.menuboxIconBox, marginBottom:6}} />
                <div style={{...styles.menuboxIconBox, marginTop:6, marginBottom:6}} />
                <div style={{...styles.menuboxIconBox, marginTop:6 }}/>
            </div>
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
        fontSize:13,
        display:'inline-block',
        verticalAlign:'center'
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
        height:32,
        marginLeft:35,
        marginRight:35,
        display:'inline-block',
        marginTop:15,

    },
    loginButton:{
        height:'100%',
        width:90,
        backgroundColor:"#405ca9",
        color:'#ffffff',
        fontSize:14,
        borderRadius:16,
        paddingTop:5,
        paddingBottom:5,
        margin: 'auto'
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