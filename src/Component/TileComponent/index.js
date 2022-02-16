import React from 'react';
import TileInfoComponent from './TileInfoComponent';


class TileComponent extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            selectedIndex:null
        }
    }
    componentDidMount() {
        window.scrollTo(0, 0)
    }
    SetState = (field, value)=> this.setState( state =>({ ...state, [field]:value } ))

    render(){
        const {selectedIndex} = this.state
        const {cellList, getTileData} = this.props
        const list = cellList.items.map((e, index)=> (
            <TileListElement key={e.element.id}
                index={index}
                value={e.element}
                isSelected={index === selectedIndex}
                onSelect={ index => this.SetState('selectedIndex', index)}
            />
        ))
            
        let selectedElement = {}
        if(selectedIndex !== null && cellList.items[selectedIndex]){
            const {id, x, y} = cellList.items[selectedIndex].element
            const tileData = getTileData(x, y)
            if(tileData){
                selectedElement = {
                    ...tileData.properties,
                    id: tileData.id
                }
            }
        }

        return (
        <div style={styles.container}>
            <div style={styles.detailContainer}>
                <div style={{width:'100%', marginTop:37, marginBottom:37}}>
                    <div style={{fontSize:40, textAlign:'center', color:"#1c367e"}}>Details</div>
                </div>
                <div style={{height:1, width:'auto', marginLeft:24, marginRight:24, backgroundColor:'#dfdfe2' }}/>
                <div style={styles.test}>
                    <div style={styles.listContainer}>
                        <ul style={{
                                width:244,
                                listStyleType:'none', 
                                display: 'table',
                                paddingTop:26,
                                paddingBottom:26
                                }}>
                            {list}
                        </ul>
                    </div>
                </div>
                
            </div>
            <div style={styles.infoContainer}>
                <TileInfoComponent selectedElement={selectedElement} />
            </div>
        </div>)
    }
}

class TileListElement extends React.Component{
    constructor(props){
        super(props)
        this.state = {}
    }
    render(){
        const {value, index, onSelect, isSelected} = this.props
        const {id, x, y} = value
        return (
            <li className='hovered' onClick={()=>onSelect(index)}
                style={isSelected ? styles.selectedItem : styles.unselectedItem }>
                <span>{"Tile" + ('00000' + id).slice(-5)}</span>
            </li>
        )
    }
}

const styles = {
    container:{
        height:'750px',
        display:'flex',
        paddingLeft:200,
        paddingRight:200
    },
    infoContainer:{
        flex:1,
        marginLeft:13,
        marginRight:13,
        backgroundColor:'#f2f3f9',
        float:'left',
        paddingLeft: 94,
        paddingRight: 94
    },
    detailContainer:{
        display:'block',
        width:288,
        height:'100%',
        float:'left',
        backgroundColor:'#f2f3f9',
    },
    test:{
        height: '80%',
        overflow: "hidden"
    },
    listContainer:{
        width:'100%',
        height: "100%",
        paddingRight:17,
        boxSizing:"content-box",
        overflowY:'scroll',
    },
    selectedItem:{
        width:'100%',
        backgroundColor: '#405ca9',
        textAlign:'center',
        height:40,
        padding: 10,
        color:'#fff'
    },
    unselectedItem:{
        width:'100%',
        height:40,
        textAlign:'center',
        padding: 10,
    },
    box:{
    }
}

export default TileComponent