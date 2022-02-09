import React, { StyleSheet, useRef, useEffect, useState } from 'react';
import MapComponent from '../Component/MapComponent';
import { Row, Col, Container } from 'react-bootstrap';


function LoginContainer(){
    return (
        <div style={styles.container}>
            <Row>
                
            </Row>
        </div>
    )
}

const styles = {
    container:{
        position:'absolute',
        top:0,
        left:0,
        width:'100%',
        height:'100%',
        opacity:0.2,
        backgroundColor:'black'
    }
}


export default LoginContainer