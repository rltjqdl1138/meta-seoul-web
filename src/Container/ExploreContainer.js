import React from 'react';
import MapComponent from '../Component/MapComponent';
import TileComponent from '../Component/TileComponent';
class QueueItem {
    constructor(element, priority){
        this.element = element
        this.priority = priority
    }
}
class Queue{
    constructor(){
        this.items = [];
    }
    clear(){
        this.items = []
    }
    push(element, priority)
    {
        if(priority === undefined) return;
        var qElement = new QueueItem(element, priority);
        var contain = false;
     
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].priority > qElement.priority) {
                this.items.splice(i, 0, qElement);
                contain = true;
                break;
            }
        }
     
        if (!contain) this.items.push(qElement);
    }
    del(priority){
//        const ind = this.find(priority)
//        if(ind === -1) return
        this.items.splice(this.find(priority), 1)
        //this.items = [...this.items.slice(0,ind), ...this.items.slice(ind+1, this.items.length)]
    }
    
    find(priority){
        let first=-1, last=this.items.length
        if(last === 0) return -1
        while(first<last && last !== 0){
            const ind = Math.floor((first+last)/2)
            const val = this.items[ind].priority
            if(val === priority) return ind
            if(ind === first) return -1
            if(val < priority) first = ind
            else last = ind
        }
        return -1
    }
}

class MapContainer extends React.Component{
    constructor(props){
        super(props)
        const selectedCells = new Queue()

        this.state = {
            history:[],
            selectedCells,
            tempCount: 0,
            zoom:15.0000,
            clearMap: ()=>{},
            getTileData: ()=>{},
        }
    }
    SetState = (field, value)=> this.setState( state =>({ ...state, [field]:value } ))
    ClearMap = ()=>{
        const {clearMap, selectedCells} = this.state
        selectedCells.items.forEach(({element}) => clearMap(element.id))
        this.setState( state =>({
            ...state,
            selectedCells:new Queue(),
            history:[]
        }))
    }
    Undo = ()=>{
        const {clearMap, selectedCells, history} = this.state
        if(history.length === 0) return;
        const lastHistory = history[history.length-1]

        for(let i=0; i<lastHistory.length; i++){
            clearMap(lastHistory[i])
            selectedCells.del(lastHistory[i].id)
        }

        this.setState( state =>({
            ...state,
            selectedCells,
            history: history.slice(0, history.length-1)
        }))
    }
    selectCell = (list) =>{
        const {selectedCells, history} = this.state
        const historyItem = []
        list.forEach(element =>{
            if( selectedCells.find(element.id) === -1){
                selectedCells.push(element,element.id)
                historyItem.push({id:element.id, contract_id:element.contract_id})
            }
        })
        this.setState( state =>({
            ...state,
            history: historyItem.length ? [...history, historyItem] : history,
            selectedCells,
            tempCount:0
        }))
    }
    getTotal = ()=>{
        return this.state.tempCount + this.state.selectedCells.items.length
    }
    selectBox = ()=>{
        const {tempCount, selectedCells} = this.state
        const selectedTotal = selectedCells.items.length
        const total = this.getTotal()
        return (
            <div style={modalStyles.container}>
                <div className="titleInfo-border"  style={modalStyles.background} />
                <div style={modalStyles.uiContainer}>
                    <div style={modalStyles.countContainer}>
                        <div onClick={()=>this.Undo()} style={modalStyles.countClearButton}>
                            <img style={modalStyles.countClearImage} src="/tile-icon-small.png" />
                        </div>
                        <div style={modalStyles.countTextContainer}>
                            <div style={modalStyles.otherCountText}>
                                { total === 0 ? 'There is no tile selected.' : `${total}/200 Tile Selected`}
                            </div>
                        </div>
                    </div>
                    <div>
                        zoom:{this.state.zoom}
                    </div>
                    <div style={modalStyles.detailButtonContainer}>
                        <div className="hovered"
                                style={{...modalStyles.detailButton, backgroundColor: selectedTotal ?"#405ca9":'#b7b7b7'}}
                                onClick={()=> selectedTotal ? window.scrollTo(0, document.body.scrollHeight) : null} >
                            Detail
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    render(){
        const {tempCount, selectedCells, getTileData} = this.state
        return (
            <div>
                <MapComponent
                    total={this.getTotal}
                    setProps={this.SetState}
                    onSelect={this.selectCell}
                />
                <div style={{width:"100%"}}>
                    <TileComponent
                        getTileData={getTileData}
                        cellList={selectedCells}
                    />
                </div>
                {this.selectBox()}
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

export default MapContainer
