
function OpenSeaCard({openseaLink, imageURL, description, name, onClick}){
  return(
    <div style={styles.card}>
      <a href={onClick ? "#":openseaLink} onClick={onClick?()=>onClick() : ()=>{}} style={{textDecoration: 'none'}}>
        <div style={styles.cardContainer}>
          <div style={styles.cardMainContainer}>
            <div style={styles.cardImageContainer}>
              <img src={imageURL} style={styles.cardImage}/>
            </div>
            <div style={styles.cardInfoContainer}>
              <div style={styles.cardTitle}>
                {name}
              </div>
              <div style={styles.cardDescription}>
                {description}
              </div> 
            </div>
          </div>
          <div style={styles.cardFooterContainer}>
            <div style={styles.cardFotterLine} />
            <div style={styles.cardFooterImageContainer}>
              <img src="/land-markers-logo-white.png" style={styles.cardFooterImage}/>
            </div>
          </div>
        </div>
      </a>
    </div>
  )
}
const styles={
  container:{
    display:'flex',
    flexWrap:'wrap',
    paddingLeft:66,
    paddingRight:66,
  },
  card:{
    width:290,
    height:390,
    padding:20
  },
  cardContainer:{
    width:'100%',
    height:'100%',
    borderRadius:5,
    borderWidth:1,
    borderColor:'#ebebeb',
    borderStyle:'solid',
    boxShadow: "0 0 8px 0 rgba(31, 31, 31, 0.2)",
    display:'flex',
    flexDirection:'column'
  },
  cardMainContainer:{
    paddingLeft:24,
    paddingRight:24,
    paddingTop:24,

  },
  cardImageContainer:{
    width:202,
    height:202,
    borderStyle:'solid',
    borderWidth:1,
    borderColor:"#7da7d9",
    display:"flex",
    justifyContent: "center"
  },
  cardImage:{
    width:'100%',
    height:'100%',
    objectFit:'contain'
  },
  cardInfoContainer:{
    paddingTop:36,
    flex:1
  },
  cardTitle:{
    fontFamily:'NotoSansCJKkr',
    fontSize:16,
    fontWeight:'bold',
    color:'#17508a',
  },
  cardDescription:{
    fontFamily:'NotoSansCJKkr',
    fontSize:12,
    color:'#3b3b3b',
  },
  cardFooterContainer:{
    height:45,
    paddingTop:11,
    paddingBottom:11,
    paddingLeft:26,
    paddingRight:16,
    display:'flex'
  },
  cardFotterLine:{
    flex:1,
    height:1,
    borderColor:'#55bceb',
    borderWidth:0,
    borderStyle:'solid',
    backgroundColor:'#e5ecf4',
    marginTop:11,
  },
  cardFooterImageContainer:{
    width:26,
    height:22,
    marginLeft:12,
  },
  cardFooterImage:{
    width:26,
    height:22,
    objectFit:'contain',
    marginTop:-7
  }
}

export default OpenSeaCard