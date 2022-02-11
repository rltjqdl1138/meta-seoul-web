import React from 'react';

class TileInfoComponent extends React.Component{
    constructor(props){
        super(props)
        this.state = {}
    }
    render(){
        const {selectedElement} = this.props
        const isEmpty = !selectedElement || selectedElement.id === undefined
        return (
            <div style={styles.container}>
                <div style={styles.accountContainer}>
                    <img src="/profile.png" style={styles.profileImage}/>
                    <div style={styles.accountInfo}>
                        <div style={styles.nicknameText}>
                            Nickname
                        </div>
                        <div style={styles.addressText}>
                            metamask id
                        </div>
                    </div>
                </div>
                <div style={styles.tileInfoContainer}>
                    <div className="titleInfo-border" style={{...styles.tileInfoItem, backgroundColor:"#f5f5f5"}}>
                        <div style={styles.tileInfoTitle}>
                            <div style={styles.titleInfoTitleText}>
                                Tile name
                            </div>
                        </div>
                        <div style={styles.tileInfoContent}>
                            <div style={styles.titleInfoContentText}>
                               {isEmpty ? null: "Tile" + ('00000' + selectedElement.id).slice(-5) }
                            </div>
                        </div>
                    </div>
                    <div className="titleInfo-border" style={{...styles.tileInfoItem, backgroundColor:"#ffffff"}}>
                        <div style={styles.tileInfoTitle}>
                            <div style={styles.titleInfoTitleText}>
                                Tile NFT number
                            </div>
                        </div>
                        <div style={styles.tileInfoContent}>
                            <div style={styles.titleInfoContentText}>
                                {isEmpty ? "" : "115792089237316195423570985008687907824005701110439856181607367768781063454596"}
                            </div>
                        </div>
                        
                    </div>
                    <div className="titleInfo-border" style={{...styles.tileInfoItem, backgroundColor:"#f5f5f5"}}>
                        <div style={styles.tileInfoTitle}>
                            <div style={styles.titleInfoTitleText}>
                                Tile location
                            </div>
                        </div>
                        <div style={styles.tileInfoContent}>
                            <div style={styles.titleInfoContentText}>
                                {isEmpty ? "" : "aa"}
                            </div>
                        </div>

                    </div>
                    <div className="titleInfo-border" style={{...styles.tileInfoItem, backgroundColor:"#ffffff"}}>
                        <div style={styles.tileInfoTitle}>
                            <div style={styles.titleInfoTitleText}>
                                Tile Coordinate
                            </div>
                        </div>
                        <div style={styles.tileInfoContent}>
                            <div style={styles.titleInfoContentText}>
                                { isEmpty ? "" : `${selectedElement.x},${selectedElement.y}`}
                            </div>
                        </div>
                        
                    </div>
                    <div className="titleInfo-border" style={{...styles.tileInfoItem, backgroundColor:"#f5f5f5"}}>
                        <div style={styles.tileInfoTitle}>
                            <div style={styles.titleInfoTitleText}>
                                Tile tier
                            </div>
                        </div>
                        <div style={styles.tileInfoContent}>
                            <div style={styles.titleInfoContentText}>
                                {isEmpty ? null :
                                (<div style={{ paddingTop:1, marginTop:5, textAlign:'center', height:29, fontSize:18, width:58, borderRadius:3, backgroundColor:"#e74d3d", color:"#fff"}}>
                                    Tier 1
                                </div>) }
                            </div>
                        </div>

                    </div>
                    <div className="titleInfo-border" style={{...styles.tileInfoItem, backgroundColor:"#ffffff"}}>
                        <div style={styles.tileInfoTitle}>
                            <div style={styles.titleInfoTitleText}>
                                Current Market Value
                            </div>
                        </div>
                        <div style={styles.tileInfoContent}>
                            <div style={styles.titleInfoContentText}>
                                {isEmpty ? "" : "4.5ETH"}
                            </div>
                        </div>
                        
                    </div>
                    
                    <div className="titleInfo-border" style={{...styles.tileInfoItem, backgroundColor:"#f5f5f5"}}>
                        <div style={styles.tileInfoTitle}>
                            <div style={styles.titleInfoTitleText}>
                                Buy Now for
                            </div>
                        </div>
                        <div style={styles.tileInfoContent}>
                            <div style={styles.titleInfoContentText}>
                                {isEmpty ? "" : "4.7ETH"}
                            </div>
                        </div>
                    </div>
                </div>
                <div style={styles.openSeaButtonContainer}>
                    <a target="_blank" href="https://opensea.io/assets/0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d/115792089237316195423570985008687907824005701110439856181607367768781063454596">
                        <img className='hovered'
                            src="/open-sea-logo.png" style={styles.openSeaButton}/>
                    </a>
                </div>
            </div>
        )
    }
}

const styles = {
    container:{
        width:'100%',
        height:'100%',
        padding:46,
        display:'flex',
        flexDirection:'column'
    },
    accountContainer:{
        width:'100%',
        height:76,
        marginTop: 15,
        marginBottom:15,
        display:'flex'
    },
    profileImage:{
        width:76,
        height:76
    },
    accountInfo:{
        flex:1,
        marginLeft:21,
        padding:3,
        marginBottom:8
    },
    nicknameText:{
        fontSize:30,
        height: 45,
        textAlign:'left',
    },
    addressText:{
        fontSize:20,
        height: 25,
        textAlign:'left',
    },
    tileInfoContainer:{
        width:'100%',
        flex:1,
        paddingTop:50,
        paddingBottom:50
    },
    tileInfoItem:{
        height:58,
        display:'flex'
    },
    tileInfoTitle: {
        height:'100%',
        width:220,
    },
    tileInfoContent:{
        flex:1,
        height:'100%',
        display:'block',
        overflowX:'hidden',
        paddingRight:20
    },
    
    titleInfoTitleText:{
        height:'100%',
        width:'100%',
        textAlign:'left',
        padding: 10,
        paddingLeft:23,
        fontSize: 18,
        overflowX:'hidden'
    },
    titleInfoContentText:{
        height:'100%',
        width:'100%',
        maxWidth:400,
        textAlign:'left',
        padding: 10,
        paddingLeft:23,
        fontSize: 18,
        display:'flex',
        flexDirection:'column',
        overflowX:'hidden'
    },
    openSeaButtonContainer:{

    },
    openSeaButton:{
        height:50
    }
}

export default TileInfoComponent