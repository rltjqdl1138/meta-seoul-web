import React from 'react';
import axios from 'axios'
import OpenSeaCard from '../Component/OpenSeaCard';

class NFTImageContainer extends React.Component{
    constructor(props){
        super(props)
        this.state = {list:[], isLast:true}
    }
    accessToken = null
    currentCursor = "hello"
    nextCursor = null

    componentDidMount(){
      this.load()
    }
    async load(){
        const auth = this.props.auth || {}
        const {address, accessToken} = auth
        if(!address || !accessToken) return;
        //this.accessToken = accessToken
        const {data} = await axios.get("/v1/opensea/image",{headers: {'Authorization':`Bearer ${accessToken}`}})
        const {list} = data
        
        this.setState({list, isLast:true})
    }
    render(){
        const {list, isLast} = this.state
        const Comp = list.length && list.map( (e, index) =>
            (<
              OpenSeaCard
                key={index}
                openseaLink={e.openseaLink}
                imageURL={e.imageURL}
                description="."
                name={e.name || "noname"}
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

export default NFTImageContainer