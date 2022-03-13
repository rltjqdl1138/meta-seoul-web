import React from 'react';
//import MapComponent from '../Component/MapComponent';
import MapComponent from '../Component/MapFindComponent';
import axios from 'axios'

class UploadContainer extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            id:null,
            title:'',
            address:'',
            building:'',
            handlers:{
                update:()=>{},
                delete:()=>{}
            }
        }
    }
    selectedCell = null
    SetState = (field, value)=> this.setState( state =>({ ...state, [field]:value } ))
    UpdateItem = async ()=>{
      const item = this.selectedCell
        const {id, title, handlers, address} = this.state
        
        if(title && address) item.setCheck(item.coord)
        if(id === null) return;
        const properties = {
          title,
          address 
        }
        handlers.update(id, properties)
    }
    DeleteItem = ()=>{
        const {id, handlers} = this.state
        if(id === null) return;
        handlers.delete(id)
    }
    Select1 = async(item)=>{
      const {id, properties} = item
      console.log(properties)
      let coord = properties.center
      coord = coord.slice(1, coord.length-1).split(',').map( e => Number(e))
      
      item.coord = coord
      this.selectedCell = item
      const location = await this.getGeocode(coord)
      const {region, land} = location || {}

      const {addition0} = land || {}
      if(!addition0) console.log(land)
      const building = addition0 && addition0.value

      const {area1, area2, area3, area4} = region || {}
      const address =
        [area1, area2, area3, area4]
          .map((e)=> e && e.name)
          .filter((v)=>v)
          .join(" ")
      
      this.setState( state =>({
        ...state,
        id,
        title:building || "",
        address: address || "",
      }))
    }
    Select = async(item)=>{

      const {id, properties} = item
      //console.log(properties)
      let coord = properties.center
      coord = coord.slice(1, coord.length-1).split(',').map( e => Number(e))
      
      item.coord = coord
      this.selectedCell = item

      item.setCenter(coord)
      
      

      this.setState( state =>({
        ...state,
        id,
        title: properties.title || "",
        address: properties.address || "",
      }))
    }

    async getGeocode([lng,lat]){
        const {data} = await axios.get(`/v1/geocode?lat=${lat}&lng=${lng}`)
        return data && this.convertGeocode(data[0])
    }
    
    convertGeocode = (item)=>{
        console.log(item)

        return item
    }

    render(){
        const {title, id, building, address} = this.state
        return (
            <div>
                <MapComponent
                    setProps={this.SetState}
                    onSelect={this.Select}
                />
                {/*
                
                <div style={modalStyles.container}>
                    <div style={modalStyles.background}/>
                    <div style={modalStyles.uiContainer}>
                        <div>
                            <button onClick={this.DeleteItem} > Delete </button>
                            <button onClick={this.UpdateItem}> Update </button>
                        </div>
                        <div> {id} </div>
                        <div>
                            Title <input onChange={(e)=>this.SetState('title',e.target.value)} type="text" value={title}/>
                        </div>
                        <div>
                          address <input onChange={(e)=>this.SetState('address',e.target.value)} type="text" value={address}/>
                        </div>
                        <div>
                          building <input onChange={(e)=>this.SetState('building',e.target.value)} type="text" value={building}/>
                        </div>
                    </div>
                </div>
                
                
                */}
                
            </div>
        );
    }
}

const modalStyles = {
    container:{
        position:'absolute',
        right:100,
        top:    100,
        width:  270,
        height: 500,
        backgroundColor:'#fff'
    },
    background:{
        position:'absolute',
        width:'100%',
        height:'100%',
        backgroundColor:'#fff',
        opacity: 0.95,
        borderRadius:10
    },
    uiContainer:{
        position:'absolute',
        width:'100%',
        height:'100%',
        paddingLeft:20,
        paddingRight:20,
        display:'flex',
        flexDirection:'column',
        paddingTop:16,
        paddingBottom:16,
        
    },
}

export default UploadContainer
