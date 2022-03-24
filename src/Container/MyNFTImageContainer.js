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
      const addr = "0x757f179e05c4c0dd8932e8ce12e59fd567130cff"
      console.log(addr)
      this.load(addr)
    }
    async load(otherAddress = null){
      console.log(otherAddress)
        const auth = this.props.auth || {}
        const {address, accessToken} = auth
        if(!otherAddress && (!address || !accessToken)) return;
        //this.accessToken = accessToken
        if(otherAddress){

          const {data} = await axios.get(`/v1/marketplace?owner=${otherAddress}&limit=40`,{headers: {'Authorization':`Bearer ${accessToken}`}})
          console.log(data)
          const {assets} = data
          this.setState({list:assets, isLast:true})
        }else{

          const {data} = await axios.get("/v1/user/image",{headers: {'Authorization':`Bearer ${accessToken}`}})
          const {list} = data
          this.setState({list, isLast:true})
        }
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