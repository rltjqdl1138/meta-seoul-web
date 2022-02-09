
import React, { useRef, useEffect, useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';

function HeaderContainer(){
    return (
        <Row style={styles.container}>
            <Col>
                랜드구매
            </Col>
            <Col>
                마켓플레이스
            </Col>
            <Col>
                로고
            </Col>
            <Col>
                소식
            </Col>
            <Col>
                커뮤니티
            </Col>
            <Col>
                고객지원
            </Col>
            <Col>
                <Button>
                로그인

                </Button>
            </Col>
        </Row>
    )
}

const styles = {
    container:{
        height: 70
    }
}

export default HeaderContainer