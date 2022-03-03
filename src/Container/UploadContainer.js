import React from 'react';
//import MapComponent from '../Component/MapComponent';
import MapComponent from '../Component/MapFindComponent';

class UploadContainer extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            id:null,
            title:'',
            handlers:{
                update:()=>{},
                delete:()=>{}
            }
        }
    }

    SetState = (field, value)=> this.setState( state =>({ ...state, [field]:value } ))
    UpdateItem = ()=>{
        const {id, title, handlers} = this.state
        if(id === null) return;
        const properties = {
            title
        }
        handlers.update(id, properties)
    }
    DeleteItem = ()=>{
        const {id, handlers} = this.state
        if(id === null) return;
        handlers.delete(id)
    }
    
    Select = (item)=>{
        const {id, properties} = item
        this.setState( state =>({
            ...state,
            id,
            title: properties.title || "",
        }))
    }

    render(){
        const {title, id} = this.state
        return (
            <div>
                <MapComponent
                    setProps={this.SetState}
                    onSelect={this.Select}
                />
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

                        </div>
                    </div>
                </div>
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
