
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = 'pk.eyJ1Ijoicmx0anFkbDExMzgiLCJhIjoiY2t6ZHVrOXFxMDZpODJ2cDJidHh2cmZ6aCJ9.N39L45pDFuKBS5OuX0GBXg';

const data = require('../data.json')

function MapComponent({onSelect, setProps, total}) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(126.97841);
    const [lat, setLat] = useState(37.56667);
    const [zoom, setZoom] = useState(15);
    let hoveredStateId = null;
    
    let hoveredCell = {}
    let selectedCell = null

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
            setProps("clearMap", (id)=>{
                map.current.setFeatureState( { source: 'states', id },{ hover: false, selected:false } );
            })
            setProps("enableNotice", (id)=>{
                map.current.setFeatureState( { source: 'states', id },{ notice: false } );
            })
            setProps("disableNotice", (id)=>{
                map.current.setFeatureState( { source: 'states', id },{ notice: true } );
            })
            
            map.current.on('click', (e) => {
                if(!selectedCell)
                    selectedCell = hoveredCell
                else{
                    const {x:startX,y:startY} = selectedCell.properties
                    const {x:endX, y:endY } = hoveredCell.properties
                    const start_y = startY < endY ? startY : endY
                    const start_x = startX < endX ? startX : endX
                    const end_x = startX < endX ? endX : startX
                    const end_y = startY < endY ? endY : startY
                    
                    const list = []

                    for(let x=start_x; x<=end_x; x++)
                        for(let y=start_y; y<=end_y; y++){
                            if( total() <= 200){
                                map.current.setFeatureState( { source: 'states', id: x*100 + y },{ hover: false, selected:true } );
                                list.push({id:x*100+y, x, y})
                            }else
                                map.current.setFeatureState( { source: 'states', id: x*100 + y },{ hover: false } );
                        }
                    selectedCell = null
                    onSelect(list)
                }
            });

            map.current.on('mousemove', 'state-fills', e => {
                if (e.features.length > 0) {
                    if(!selectedCell){
                        if (hoveredStateId !== null)
                            map.current.setFeatureState( { source: 'states', id: hoveredStateId }, { hover: false } );
                        hoveredStateId = e.features[0].id;
                        map.current.setFeatureState( { source: 'states', id: hoveredStateId },{ hover: true } );
                    }else{
                        const {x:startX,y:startY} = selectedCell.properties
                        const { x:endX,  y:endY } = e.features[0].properties
                        const {x:lastX, y:lastY } = hoveredCell.properties
                        const isExtendedX = Math.abs(startX - endX) - Math.abs(startX - lastX) > 0 ? true : false
                        const isExtendedY = Math.abs(startY - endY) - Math.abs(startY - lastY) > 0 ? true : false
                        const totalSelected = (Math.abs(startX-endX)+1)*(Math.abs(startY-endY)+1)
                        setProps('tempCount', totalSelected)

                        if (hoveredStateId !== null){
                            if(endX !== lastX && endY !== lastY){
                                if( !isExtendedX && !isExtendedY )
                                    map.current.setFeatureState( { source: 'states', id: lastX*100 + lastY },{ hover: false } );
                            }
                            if(endX !== lastX){
                                const isExtended = isExtendedX
                                
                                const start_y = startY < endY ? startY : endY
                                const end_y = startY < endY ? endY : startY

                                const start_x = isExtended ? ( lastX < endX ? lastX : endX ) : ( lastX < endX ? lastX-1 : endX +1)
                                const end_x = isExtended ?   ( lastX < endX ? endX : lastX-1 ) : ( lastX < endX ? endX: lastX )

                                for(let y = start_y; y <= end_y; y++){
                                    for(let x = start_x; x <= end_x; x++)
                                        map.current.setFeatureState( { source: 'states', id: x*100 + y },{ hover: isExtended } );
                                    
                                }
                            }
                            if(endY !== lastY){

                                const isExtended = isExtendedY
                                
                                const start_x = startX < endX ? startX : endX
                                const end_x = startX < endX ? endX : startX

                                const start_y = isExtended ? ( lastY < endY ? lastY : endY ) : ( lastY < endY ? lastY-1 : endY +1)
                                const end_y = isExtended ?   ( lastY < endY ? endY : lastY-1 ) : ( lastY < endY ? endY: lastY )

                                for(let x = start_x; x <= end_x; x++){
                                    for(let y = start_y; y <= end_y; y++)
                                        map.current.setFeatureState( { source: 'states', id: x*100 + y },{ hover: isExtended } );
                                    
                                }
                            }
                            hoveredStateId = e.features[0].id;
                            //map.current.setFeatureState( { source: 'states', id: hoveredStateId },{ hover: true } );
                        }


                    }
                    hoveredCell = e.features[0]
                }
            });

            map.current.on('mouseleave', 'state-fills', () => {
                if(!selectedCell){
                    if (hoveredStateId !== null) 
                        map.current.setFeatureState({ source: 'states', id: hoveredStateId }, { hover: false });
                    hoveredStateId = null;
                }
            });
        })
    });
    return (
        <div>
            <div style={{width:"100%", height:"814px"}} ref={mapContainer} className="map-container" />
        </div>
    );
}


export default MapComponent;
