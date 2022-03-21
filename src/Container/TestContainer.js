import React from 'react';
import axios from 'axios'

class TestContainer extends React.Component{
    constructor(props){
        super(props)
        this.state = {list:[], isLast:true}
    }
    accessToken = null
    currentCursor = "hello"
    nextCursor = null
    /*
    componentDidUpdate(prevProps, prevState){
        if(this.accessToken !== null ) return
        this.load(prevProps)
    }*/
    componentDidMount(){
      this.loadMarket()
    }
    async loadMarket(){
      if(this.nextCursor === this.currentCursor){
        console.log('same~')
        return;
      }
      this.currentCursor = this.nextCursor
      const offsetQuery = this.nextCursor ? `&cursor=${this.nextCursor}`:""
      const {data} = await axios.get("/v1/marketplace?limit=40"+offsetQuery)
      const {assets} = data
  
      this.nextCursor = data.next
      this.setState(state => ({list:[...state.list, ...assets], isLast:!data.next}))
    }
    async load(props){
        //const auth = props.auth || {}
        //const {address, accessToken} = auth
        //if(!address || !accessToken) return;
        const {data} = await axios.get("/v1/marketplace")
        //this.accessToken = accessToken
        //const {data} = await axios.get("/v1/marketplace",{headers: {'Authorization':`Bearer ${accessToken}`}})
        const {assets} = data
        console.log(assets[0])
        this.setState({list:assets})
    }
    render(){
        const {list, isLast} = this.state
        const Comp = list.length && list.map( e =>
            (<
              OpenSeaCard
                key={e.id}
                permalink={e.permalink}
                image_url={e.image_url}
                description={e.description}
                name={e.name}
            />)
        )
        return (
          <div >
              <div style={styles.container}>
              {Comp}
              </div>
              <div>
                <button style={{display:isLast?'none':''}} onClick={()=>this.loadMarket()}>
                  Load More
                </button>
              </div>
          </div>
        )
    }
}
function OpenSeaCard({permalink, image_url, description, name}){
  return(
    <div style={styles.card}>
      <a href={permalink} style={{textDecoration: 'none'}}>
        <div style={styles.cardContainer}>
          <div style={styles.cardImageContainer}>
            <img src={image_url} style={styles.cardImage}/>
          </div>
          <div style={styles.cardInfoContainer}>
            <div style={styles.cardTitle}>
              {name}
            </div>
            <div style={styles.cardDescription}>
              {description}
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
    paddingRight:66
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
  cardImageContainer:{
    padding:25
  },
  cardImage:{
    width:'100%',
    height:'100%'
  },
  cardInfoContainer:{
    paddingTop:11,
    paddingBottom:11,
    paddingLeft:25,
    paddingRight:25,
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
    height:38,
    marginBottom:8,
    paddingTop:8,
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

export default TestContainer