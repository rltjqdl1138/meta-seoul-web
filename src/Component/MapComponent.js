
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = 'pk.eyJ1Ijoicmx0anFkbDExMzgiLCJhIjoiY2t6ZHVrOXFxMDZpODJ2cDJidHh2cmZ6aCJ9.N39L45pDFuKBS5OuX0GBXg';

function MapComponent({onSelect, setProps, total}) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(126.97841);
    const [lat, setLat] = useState(37.56667);
    const [zoom, setZoom] = useState(15);
    let hoveredStateId = null;
    
    let hoveredCell = {}
    let selectedCell = null
    const load = (contract_id)=>{
        map.current.on('wheel', e=>{
            setProps('zoom', map.current.getZoom().toFixed(4))
        })
        
        map.current.addSource(contract_id, {
            type:'geojson',
            data:`/${contract_id}.json`
        });
        map.current.addLayer({
            id:         contract_id+'-fills',
            type:       'fill',
            source:     contract_id,
            layout:     {},
            paint:      {
                'fill-color': '#627BC1',
                'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    0.9,
                    0.2
                ]
            }
        });
        
        map.current.addLayer({
            id:         contract_id+'-selected',
            type:       'fill',
            source:     contract_id,
            layout:     {},
            paint:      {
                'fill-color': '#427ba9',
                'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'selected'], false],
                    0.9,
                    0
                ]
            }
        });
            
        map.current.addLayer({
            'id': contract_id+'-borders',
            'type': 'line',
            'source': contract_id,
            'layout': {},
            'paint': {
            'line-color': '#627BC1',
            'line-width': 1
            }
        });
        map.current.on('wheel', e=>{
            setProps('zoom', map.current.getZoom().toFixed(4))
        })
        setProps("clearMap", (id)=>{
            map.current.setFeatureState( { source:'2953399124f0cbb46d2cbacd8a89cf0599974963', id },{ hover: false, selected:false } );
        })
        setProps("enableNotice", (source, id)=>{
            map.current.setFeatureState( { source, id },{ notice: false } );
        })
        setProps("disableNotice", (source, id)=>{
            map.current.setFeatureState( { source, id },{ notice: true } );
        })
        setProps("getTileData", (x, y)=>{
            contract_id = '2953399124f0cbb46d2cbacd8a89cf0599974963'
            const list = map.current.querySourceFeatures(contract_id,{
                filter: [
                    'all',
                    ['==','x', x ],
                    ['==','y', y ]
                ]
            })
            return list ? list[0] : null 
        })

        map.current.on('mousemove', contract_id+'-fills', e => {
            if (e.features.length > 0) {
                if(!selectedCell){
                    if (hoveredStateId !== null)
                        map.current.setFeatureState( { source: contract_id, id: hoveredStateId }, { hover: false } );
                    hoveredStateId = e.features[0].id;
                    map.current.setFeatureState( { source: contract_id, id: hoveredStateId },{ hover: true } );
                }else{
                    if( selectedCell.source !== contract_id ) {
                        return
                    }else{
                        console.log('go')
                    }

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
                                map.current.setFeatureState( { source: contract_id, id: lastX*100 + lastY },{ hover: false } );
                        }
                        if(endX !== lastX){
                            const isExtended = isExtendedX
                            
                            const start_y = startY < endY ? startY : endY
                            const end_y = startY < endY ? endY : startY

                            const start_x = isExtended ? ( lastX < endX ? lastX : endX ) : ( lastX < endX ? lastX-1 : endX +1)
                            const end_x = isExtended ?   ( lastX < endX ? endX : lastX-1 ) : ( lastX < endX ? endX: lastX )

                            for(let y = start_y; y <= end_y; y++){
                                for(let x = start_x; x <= end_x; x++)
                                    map.current.setFeatureState( { source: contract_id, id: x*100 + y },{ hover: isExtended } );
                                
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
                                    map.current.setFeatureState( { source: contract_id, id: x*100 + y },{ hover: isExtended } );
                                
                            }
                        }
                        hoveredStateId = e.features[0].id;
                        //map.current.setFeatureState( { source: 'states', id: hoveredStateId },{ hover: true } );
                    }


                }
                hoveredCell = e.features[0]
            }
        });

        map.current.on('mouseleave', contract_id+'-fills', () => {
            if(!selectedCell){
                if (hoveredStateId !== null) 
                    map.current.setFeatureState({ source: contract_id, id: hoveredStateId }, { hover: false });
                //hoveredStateId = null;
            }
        });
        
    }
    useEffect(() => {
        if (map.current) return;
        map.current = new mapboxgl.Map({
            container:mapContainer.current,
            style:    'mapbox://styles/mapbox/streets-v11',
            doubleClickZoom:false,
            center:   [lng, lat],
            zoom:     zoom
        });
        map.current.on('load',()=>{
            load('d2F668a8461D6761115dAF8Aeb3cDf5F40C532C6')
            load('2953399124f0cbb46d2cbacd8a89cf0599974963')

            
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
                const {source:contract_id} = selectedCell
                console.log(selectedCell)
                console.log(contract_id)
                const list = []

                for(let x=start_x; x<=end_x; x++)
                    for(let y=start_y; y<=end_y; y++){
                        if( total() <= 200){
                            map.current.setFeatureState( { source: contract_id, id: x*100 + y },{ hover: false, selected:true } );
                            list.push({id:x*100+y, x, y})
                        }else
                            map.current.setFeatureState( { source: contract_id, id: x*100 + y },{ hover: false } );
                    }
                selectedCell = null
                onSelect(list)
            }
        });
            //loadArea('d2F668a8461D6761115dAF8Aeb3cDf5F40C532C6')
            //loadArea('2953399124f0cbb46d2cbacd8a89cf0599974963')
            /*
            map.current.on('wheel', e=>{
                setProps('zoom', map.current.getZoom().toFixed(4))
            })
            //loadArea('d2F668a8461D6761115dAF8Aeb3cDf5F40C532C6')
            //loadArea('2953399124f0cbb46d2cbacd8a89cf0599974963')
            
            map.current.addSource('states', {
                type:'geojson',
                data:'/2953399124f0cbb46d2cbacd8a89cf0599974963.json'
            });
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
                        0.9,
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
                    'fill-color': '#427ba9',
                    'fill-opacity': [
                        'case',
                        ['boolean', ['feature-state', 'selected'], false],
                        0.9,
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
            map.current.on('wheel', e=>{
                setProps('zoom', map.current.getZoom().toFixed(4))
            })
            setProps("clearMap", (id)=>{
                map.current.setFeatureState( { source: 'states', id },{ hover: false, selected:false } );
            })
            setProps("enableNotice", (id)=>{
                map.current.setFeatureState( { source: 'states', id },{ notice: false } );
            })
            setProps("disableNotice", (id)=>{
                map.current.setFeatureState( { source: 'states', id },{ notice: true } );
            })
            setProps("getTileData", (x, y)=>{
                const list = map.current.querySourceFeatures('states',{
                    filter: [
                        'all',
                        ['==','x', x ],
                        ['==','y', y ]
                    ]
                })
                return list ? list[0] : null 
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
            */
        })
    });
    return (
        <div>
            <div style={{width:"100%", height:"814px"}} ref={mapContainer} className="map-container" />
        </div>
    );
}


export default MapComponent;
