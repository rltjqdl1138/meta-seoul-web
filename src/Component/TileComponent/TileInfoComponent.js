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
        console.log(selectedElement)
        console.log(center)
        const coord = center ? center.map((e)=>e.slice(0,8)).join(', ') : ""
        const imgURL = "/images/" + String(selectedElement.id).padStart(3,'0') + '.png'
        console.log(imgURL)
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

              <Info title="Tile id" value={id}/>
              <Info title="Tile name" value={title}/>
              <Info title="Tile location" value={address}/>
              <Info title="Tile Coordinate" value={coord}/>
              <Info title="Tile Owner" value=""/>
              <Info title="Tile Current Market Value" value={price}/>
              <Info title="Buy Now for" value={price}/>
              
            </div>
            <div style={styles.openSeaButtonContainer}>
              <img src="/open-sea-logo.png" style={styles.openSeaButton}/>
            </div>
          </div>
        )
    }
}
function Info({title, value}){
  return (
    
    <div style={styles.infoContainer}>
      <div style={styles.textInfoContainer}>
        <div style={styles.textInfotitle}>
          {title}
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
      flexDirection:'row'
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
      width:128,
      height:128,
      marginBottom:7
    },
    shortcutImage:{
      width:'100%',
      height:'100%'
    },
    infoContainer:{
      paddingBottom:7,
    },
    textInfoContainer:{
      paddingTop:18,
      height:80
    },
    textInfotitle:{
      fontSize:16,
    },
    textInfoContent:{
      height:40,
      width:'100%',
      fontSize:14,
      backgroundColor:'#e8edf5',
      borderRadius:3,
      margin:'auto',
      lineHeight:3,
      paddingLeft:17
    },
    openSeaButtonContainer:{
      marginTop:25,
      marginBottom:24,
      paddingLeft:105,
      paddingRight:105,
      height:39
    },
    openSeaButton:{
      widht:'100%',
      height:'100%'
    }
}

export default TileInfoComponent