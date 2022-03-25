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
    componentDidMount(){
      this.load()
    }
    async load(){
        const auth = this.props.auth || {}
        const {address, accessToken} = auth
        if(!address || !accessToken) return;

        const {data} = await axios.get("/v1/user/image",{headers: {'Authorization':`Bearer ${accessToken}`}})
        const {list} = data
        this.setState({list, isLast:true})
    }

    render(){
        const {list, isLast} = this.state
        console.log(list)
        const Comp = list.length ? list.map( e =>
            (<
              OpenSeaCard
                key={e.id}
                openseaLink={e.permalink}
                imageURL={e.image_url}
                description={e.description}
                name={e.name}
            />) 
        ): null
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