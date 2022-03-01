import React from 'react';
//import MapComponent from '../Component/MapComponent';
import MapComponent from '../Component/MapFindComponent';

class UploadContainer extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            history:[],
            tempCount: 0,
            zoom:15.0000,
        }
    }

    SetState = (field, value)=> this.setState( state =>({ ...state, [field]:value } ))

    render(){
        return (
            <div>
                <MapComponent
                    total={this.getTotal}
                    setProps={this.SetState}
                    onSelect={this.selectCell}
                />
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
        height: 140,
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
    countContainer:{
        width:'100%',
        height:21,
        display:'flex',
        marginBottom:8
    },
    countClearButton:{
        height:'100%',
        width:21
    },
    countClearImage:{
        width:'100%',
        height:'100%'
    },
    countTextContainer:{
        flex:1,
        paddingLeft: 14,
        paddingRight:14,
        flexDirection:'row',
        display:'flex'
    },
    otherCountText:{
        flex:1,
        height:'100%',
        textAlign:'left',
        fontSize:16
    },
    mainContainer:{
        flex:1,
        width:'100%'
    },
    detailButtonContainer:{
        height:36,
        width:'100%',
        marginTop:13,
        marginBottom:13
    },
    detailButton:{
        height:'100%',
        width:130,
        color:'#ffffff',
        borderRadius:18,
        paddingTop:5,
        paddingBottom:5,
        margin: 'auto'
    }

}

export default UploadContainer
