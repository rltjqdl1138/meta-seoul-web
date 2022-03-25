import React from 'react';
import axios from 'axios'
import OpenSeaCard from '../Component/OpenSeaCard';

class NFTImageContainer extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      list:[],
      pagination:{},
      column: this.GetColumn(),
    }
  }
  loading = false
  accessToken = null
  currentCursor = "hello"
  nextCursor = null

  componentDidMount(){
    this.load()
    this.AddHandler()
  }
  GetColumn(){
    const column = Math.floor((window.document.body.clientWidth - 132)/290)
    return column
  }
  AddHandler(){
    const {column} = this.state
    const handler = (e)=>{
      const newColumn = this.GetColumn()
      if(newColumn !== column){
        this.setState(state => ({...state, column:newColumn}))
      }
    }
    window.document.addEventListener('scroll', (e)=>{
      if(this.loading === false && window.innerHeight + window.scrollY === window.document.body.clientHeight){
        this.loading = true
        this.load()
      }
    })
    window.addEventListener('resize', handler);
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
      const limit = this.state.column*3;
      const nextPage = 1
      pagingQuery = `limit=${limit}&page=${nextPage}`
    }
    const {data} = await axios.get("/v1/nft/image?"+pagingQuery, {headers: {'Authorization':`Bearer ${accessToken}`}})
    const {list, pagination} = data
    
    this.setState(state=>({list:[...state.list, ...list], pagination}))
    this.loading = false
  }
  render(){
    const {list} = this.state
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