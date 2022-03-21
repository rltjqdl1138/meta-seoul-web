import React from 'react';
//import MapComponent from '../Component/MapComponent';
import MapComponent from '../Component/MapComponent';
import TileComponent from '../Component/TileComponent';
import TileInfoComponent from '../Component/TileComponent/TileInfoComponent';

class MapContainer extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            selectedCell: null,
            zoom:15.0000,
        }
    }
    SetState = (field, value)=> this.setState( state =>({ ...state, [field]:value } ))

    render(){
        const selectedCell = this.state.selectedCell || {}
        return (
            <div style={styles.container}>
                <div style={styles.mapContainer}>
                    <MapComponent
                        setProps={this.SetState}
                    />
                </div>
                <div style={styles.infoContainer}>
                    <TileInfoComponent selectedElement={selectedCell}/>
                </div>
            </div>
        );
    }
}
const styles = {
    container:{
        display:'flex'
    },
    mapContainer:{
        flex:1
    },
    infoContainer:{
      position:'absolute',
      right:60,
      top:93,
      width:350,
      height:828,
      borderRadius: 5,
      backgroundColor:'#fff'
    }
}
/*

<TileComponent
    getTileData={getTileData}
    cellList={selectedCells}
/>
*/

export default MapContainer
