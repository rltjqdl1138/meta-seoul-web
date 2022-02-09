
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Row, Col } from 'react-bootstrap';
mapboxgl.accessToken = 'pk.eyJ1Ijoicmx0anFkbDExMzgiLCJhIjoiY2t6ZHVrOXFxMDZpODJ2cDJidHh2cmZ6aCJ9.N39L45pDFuKBS5OuX0GBXg';

const data = require('../data.json')

function MapComponent({onSelect, selected}) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(126.97841);
    const [lat, setLat] = useState(37.56667);
    const [zoom, setZoom] = useState(15);
    let selecedStateId = null;
    let hoveredStateId = null;
    useEffect(() => {
        if (map.current) return;
        map.current = new mapboxgl.Map({
            container:mapContainer.current,
            style:    'mapbox://styles/mapbox/streets-v11',
            center:   [lng, lat],
            zoom:     zoom
        });
        map.current.on('load',()=>{
            map.current.addSource('states', data);
            map.current.addLayer({
                id:         'state-fills',
                type:       'fill',
                source:     'states',
                layout:     {},
                paint:      {
                    'fill-color': '#627BC1',
                    'fill-opacity': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        1,
                        0.2
                    ]
                }
            });
            
            map.current.addLayer({
                id:         'state-selected',
                type:       'fill',
                source:     'states',
                layout:     {},
                paint:      {
                    'fill-color': '#008000',
                    'fill-opacity': [
                        'case',
                        ['boolean', ['feature-state', 'selected'], false],
                        1,
                        0
                    ]
                }
            });
                
            map.current.addLayer({
                'id': 'state-borders',
                'type': 'line',
                'source': 'states',
                'layout': {},
                'paint': {
                'line-color': '#627BC1',
                'line-width': 1
                }
            });
            
            map.current.on('click', (e) => {
                if(selecedStateId !== null)
                    map.current.setFeatureState( { source: 'states', id: selecedStateId }, { selected: false } );
                
                onSelect( selecedStateId = hoveredStateId )
                map.current.setFeatureState( { source: 'states', id: hoveredStateId }, { selected: true } );
            });

            map.current.on('mousemove', 'state-fills', e => {
                if (e.features.length > 0) {
                    if (hoveredStateId !== null)
                        map.current.setFeatureState( { source: 'states', id: hoveredStateId }, { hover: false } );
                    
                    hoveredStateId = e.features[0].id;
                    map.current.setFeatureState( { source: 'states', id: hoveredStateId },{ hover: true } );
                }
            });

            map.current.on('mouseleave', 'state-fills', () => {
                if (hoveredStateId !== null) 
                    map.current.setFeatureState({ source: 'states', id: hoveredStateId }, { hover: false });
                hoveredStateId = null;
            });
        })
    });
    return (
        <Row>
            <Col>
                <div style={{height:"900px"}} ref={mapContainer} className="map-container" />
            </Col>
        </Row>
    );
}


export default MapComponent;
