import React, { StyleSheet, useRef, useEffect, useState } from 'react';
import MapComponent from '../Component/MapComponent';
import { Row, Col, Container } from 'react-bootstrap';

function MapContainer(){
    
    const [selected, setSelected] = useState({
        id: null
    });
    useEffect(() => {

    });
    const selectCell = (id) =>{
        const current = selected.id
        setSelected({...selected, id})
        return current;
    }
    const selectBox = ()=>{
        if(!selected.id) return null;
        return (
            <Col style={modalStyles.container}>
                <div style={modalStyles.background} />
                <div style={modalStyles.uiContainer}>
                    <button onClick={()=>selectCell(null)}>X</button>
                    <h1>선택:{selected.id}</h1>
                </div>
            </Col>
        )
    }
    return (
        <div>
            <Row style={{width:"100%"}}>
                <Col>
                    <MapComponent
                        onSelect={selectCell}
                        selected={selected.id}
                    />
                </Col>
                {selectBox()}
            </Row>
        </div>
    );
}

const modalStyles = {
    container:{
        position: "fixed",
        right:100,
        top:    100,
        width:  300,
        height: 700
    },
    background:{
        position:'absolute',
        width:'100%',
        height:'100%',
        backgroundColor:'gray',
        opacity: 0.4
    },
    uiContainer:{
        position:'absolute',
        width:'100%',
        height:'100%',
    }

}

export default MapContainer
