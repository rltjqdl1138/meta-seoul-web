import React from 'react';
import axios from 'axios';
import OpenSeaCard from '../Component/OpenSeaCard';

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
        this.setState({list:assets})
    }
    render(){
        const {list, isLast} = this.state
        console.log(list)
        const Comp = list.length && list.map( e =>
            (<
              OpenSeaCard
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
const styles={
  container:{
    display:'flex',
    flexWrap:'wrap',
    paddingLeft:66,
    paddingRight:66
  },
}

export default TestContainer