import React from 'react';
import axios from 'axios'
import OpenSeaCard from '../Component/OpenSeaCard';

class TestContainer extends React.Component{
    constructor(props){
        super(props)
        this.state = {
          wallet:null,
          openseaList:[],
          landmarkersList:[],
          isLast:true
        }
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
      const addr = "0x5f3f579d84f776826908ff1f3f1521477dad5f9f"
      console.log(addr)
      this.loadMarket(addr)
      this.load()
    }
    async loadMarket(otherAddress = null){
      const auth = this.props.auth || {}
      const {address, accessToken} = auth
      if(!otherAddress && (!address || !accessToken)) return;

      if(this.nextCursor === this.currentCursor){
        console.log('same~')
        return;
      }
      const ownerAddress = otherAddress || address
      this.currentCursor = this.nextCursor
      const offsetQuery =  this.nextCursor ? `&cursor=${this.nextCursor}`:""
      const ownerQuery = `&owner=${ownerAddress}`
      const {data} = await axios.get("/v1/marketplace?limit=40"+ownerQuery+offsetQuery)
      const {assets} = data
      this.nextCursor = data.next

      this.setState(state => ({
        ...state,
        openseaList:[...state.openseaList, ...assets],
        isLast:!data.next,
      }))
    }
    async load(){
      const auth = this.props.auth || {}
      const {address, accessToken} = auth
      if(!address || !accessToken) return;

      const {data} = await axios.get("/v1/user/image",{headers: {'Authorization':`Bearer ${accessToken}`}})
      const {list} = data
      this.setState(state => ({
        ...state,
        landmarkersList: list
      }))
    }
    async clickItem(item){
      console.log(item)
      const {data} = await axios.post('/v1/opensea/request',item)
      console.log(data)
    }
    render(){
        const {openseaList, isLast, wallet} = this.state
        const Comp = openseaList.length && openseaList.map( e =>
            (<
              OpenSeaCard
                onClick={()=>this.clickItem(e)}
                key={e.id}
                openseaLink={e.permalink}
                imageURL={e.image_url}
                description={e.description}
                name={e.name}
            />)
        )
        return (
          <div >
            <div style={styles.container}>
              <a href={"https://opensea.io/"+wallet}>
                ADDR: {wallet}
              </a>
            </div>
            <div style={styles.container}>
            {Comp}
            </div>
            <div>
              <button style={{display:isLast?'none':''}} onClick={()=>this.loadMarket(wallet)}>
                  Load More
              </button>
            </div>
          </div>
        )
    }
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
    padding:25,
    height:250
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