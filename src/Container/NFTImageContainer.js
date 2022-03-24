import React from 'react';
import axios from 'axios'
import OpenSeaCard from '../Component/OpenSeaCard';

class NFTImageContainer extends React.Component{
  constructor(props){
    super(props)
    this.state = {list:[], pagination:{}}
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
    //if(!address || !accessToken) return;
    //this.accessToken = accessToken
    let pagingQuery = ""
    if(this.state.pagination.currentPage){
      const {limit, nextPage} = this.state.pagination
      pagingQuery = `limit=${limit}&page=${nextPage}`
    }else{
      const limit = 10;
      const nextPage = 1
      pagingQuery = `limit=${limit}&page=${nextPage}`
    }
    const {data} = await axios.get("/v1/nft/image?"+pagingQuery, {headers: {'Authorization':`Bearer ${accessToken}`}})
    const {list, pagination} = data
    console.log(pagination)
    
    this.setState(state=>({list:[...state.list, ...list], pagination}))
  }
  render(){
    const {list, pagination} = this.state
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
          <button style={{display:pagination.nextPage?'':'none'}} onClick={()=>this.load()}>
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