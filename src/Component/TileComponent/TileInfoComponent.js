import React from 'react';

class TileInfoComponent extends React.Component{
    constructor(props){
        super(props)
        this.state = {}
    }
    render(){
        const {selectedElement} = this.props || {}
        const {id, price, properties, center} = selectedElement || {}
        const {address, title} = properties || {}
        const coord = center ? center.map((e)=>e.slice(0,8)).join(', ') : ""
        const imgURL = "/images/" + String(selectedElement.id).padStart(3,'0') + '.png'
        return (
          <div style={styles.container}>
            <div style={styles.header}>
              <HeaderIconDraw />
              <div style={styles.headerTextContainer}>
                <div style={styles.headerText}>Detail Information</div>
              </div>
            </div>
            <div style={styles.contentContainer}>
              <div style={styles.shortcutContainer}>
                <img src={imgURL} style={styles.shortcutImage}/>
              </div>

              <Info title="Tile id" value={id} lineWidth={60}/>
              <Info title="Tile name" value={title} lineWidth={90}/>
              <Info title="Tile location" value={address} lineWidth={108}/>
              <Info title="Tile Coordinate" value={coord} lineWidth={132}/>
              <Info title="Owner" value="3dfactory" lineWidth={66}/>
              <Info title="Current Market Value" value={price} lineWidth={180}/>
              <Info title="Buy Now for" value={price} lineWidth={110}/>

            </div>
            <div style={styles.openSeaButtonContainer}>
              <img src="/open-sea-logo.png" style={styles.openSeaButton}/>
            </div>
          </div>
        )
    }
}
function Info({title, value, lineWidth}){
  return (
    <div style={styles.infoContainer}>
      <div style={styles.textInfoContainer}>
        <div style={styles.textInfotitle}>
          {title}
          <div style={{...styles.textInfoTitleBox, width:lineWidth}} />
        </div>
        <div style={styles.textInfoContent}> 
          {value}
        </div>
      </div>
    </div>
  )
}
function HeaderIconDraw(){
  return (
    <div style={styles.headerIconContainer}>
      <div style={styles.headerIconSubContainer}>
        <div style={{width:8, height:8, marginRight:2, marginTop:2, backgroundColor:'#9cb3c8'}} />
        <div style={{width:8, height:8, marginRight:2, marginTop:2, backgroundColor:'#9cb3c8'}} />
      </div>
      
      <div style={styles.headerIconSubContainer}>
        <div style={{width:8, height:8, marginRight:2, marginTop:2, backgroundColor:'#9cb3c8'}} />
        <div style={{width:10, height:10, marginRight:2, marginTop:2, backgroundColor:'#fff'}} />
      </div>
    </div>
  )
}
const styles = {
    container:{
      width:'100%',
      height:'100%',
      borderRadius:5,
      boxShadow: "0 0 20px 0 rgba(31, 31, 31, 0.35)",
    },
    contentContainer:{
      paddingLeft:37,
      paddingTop:26,
      paddingRight:37
    },
    header:{
      width:'100%',
      height:60,
      paddingLeft:23,
      paddingTop:20,
      paddingBottom:20,
      backgroundColor:'#17508a',
      display:'flex',
      flexDirection:'row',
      borderRadius:"5px 5px 0 0",
    },
    headerIconContainer:{
      paddingRight:12,
      height:'100%',
      display:'flex',
      flexDirection:'row'
    },
    headerIconSubContainer:{
      flex:1
    },
    headerTextContainer:{
      marginTop:-3
    },
    headerText:{
      fontFamily:'Poppins-Regular',
      fontSize:18,
      color:'#ffffff'
    },
    shortcutContainer:{
      width:130,
      height:130,
      marginBottom:7,
      borderWidth:2,
      borderColor:"#7da7d9",
      borderStyle:'solid'
    },
    shortcutImage:{
      width:'100%',
      height:'100%'
    },
    infoContainer:{
      height:65,
      paddingBottom:7,
    },
    textInfoContainer:{
      paddingTop:18,
    },
    textInfotitle:{
      fontFamily:"NanumSquareEB",
      fontSize:16,
      color: "#3b3b3b",
    },
    textInfoTitleBox:{
      minWidth:60,
      maxWith:180,
      height:5,
      marginTop:-8,
      backgroundColor:'#96bae6'
    },
    textInfoContent:{
      fontFamily:"NanumSquareB",
      width:'100%',
      fontSize:14,
      margin:'auto',
      paddingTop:10,
      paddingLeft:4,
      color: "#3b3b3b",
    },
    openSeaButtonContainer:{
      paddingTop:25,
      paddingBottom:26,
      paddingLeft:105,
      paddingRight:105,
      height:92
    },
    openSeaButton:{
      widht:'100%',
      height:'100%'
    }
}

export default TileInfoComponent