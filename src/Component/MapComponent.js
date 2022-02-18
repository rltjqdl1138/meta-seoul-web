
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
    
    let loadedArea = [
        [
            '2A187453064356c898cAe034EAed119E1663ACb8',
            '2953399124f0cbb46d2cbacd8a89cf0599974963',
            '31d4C5be1082A88F2ABAFeA549B6C189C2cf057F',
        ],
        [
            'F87E31492Faf9A91B02Ee0dEAAd50d51d56D5d4d',
            'BD4455dA5929D5639EE098ABFaa3241e9ae111Af',
            'd2F668a8461D6761115dAF8Aeb3cDf5F40C532C6',
        ],
        [   
            '79986aF15539de2db9A5086382daEdA917A9CF0C',
            '495f947276749Ce646f68AC8c248420045cb7b5e',
            '6e4c6D9B0930073e958ABd2ABa516b885260b8Ff',
            
        ],
    ]
    let lastCell = null
    let hoveredCell = null
    let selectedCell = null
    const moveEvent = (currentCell)=>{
        const currentArea = findArea(currentCell.source)
        const lastArea = findArea(lastCell.contract_id)
        const firstArea = findArea(selectedCell.source)

        const startX = firstArea.x < lastArea.x ? firstArea.x : lastArea.x
        const endX = firstArea.x > lastArea.x ? firstArea.x : lastArea.x
        const startY = firstArea.y < lastArea.y ? firstArea.y : lastArea.y
        const endY = firstArea.y > lastArea.y ? firstArea.y : lastArea.y

        let isEffectX = lastCell.x === currentCell.properties.x ? false : true
        let isEffectY = lastCell.y === currentCell.properties.y ? false : true

        // 셀 진행 방향
        // 셀 
        if(isEffectX)
            for(let j=startY; j<=endY; j++)
                don(loadedArea[j][currentArea.x], currentCell, 'x')
        if(isEffectY)
            for(let i=startX; i<=endX; i++)
                don(loadedArea[currentArea.y][i], currentCell, 'y')
    }
    const don = (contract_id, currentCell, type)=>{
        const me = contract_id === currentCell.source ? true : false
        if(contract_id === selectedCell.source);

        const firstArea = findArea(selectedCell.source)
        const currentArea = findArea(contract_id)
        const lastArea = findArea(lastCell.contract_id)

        let {x:startX,y:startY} = selectedCell.properties
        const { x:endX,  y:endY } = currentCell.properties
        const {x:lastX, y:lastY } = lastCell
        if(type === 'x'){
            const AreaDirection = currentArea.x - firstArea.x
            const CellDirection = AreaDirection === 0 ? endX - startX : AreaDirection
            const hoverDirection = currentArea.x - lastArea.x || endX - lastX
            const isExtendedX = CellDirection * hoverDirection > 0
            const isOverArea = lastArea.x - currentArea.x
            const _end_x = isExtendedX ? endX : hoverDirection > 0 ? endX-1 : endX+1
            const _start_x = isOverArea!==0 ? (hoverDirection>0 ? 0 : 99) : (isExtendedX ? (hoverDirection>0 ? lastX+1 : lastX-1) : lastX)
            const end_x = _end_x > _start_x ? _end_x : _start_x
            const start_x = _end_x < _start_x ? _end_x : _start_x
            const _start_y = firstArea.y === currentArea.y ? selectedCell.properties.y : 0
            const _end_y = me ? (isExtendedX ? endY : lastY) : 99

            const start_y = _end_y > _start_y ? _start_y : _end_y
            const end_y = _end_y < _start_y ? _start_y : _end_y

            
            console.log(firstArea)
            console.log(currentArea)
            console.log(lastArea)
            console.log({CellDirection, hoverDirection, isExtendedX,isOverArea,})
            console.log(`X:${start_x}~${end_x} Y:${startY}~${endY}`)
            for(let i=start_x; i<=end_x; i++)
                for(let j=start_y; j<=end_y; j++)
                    map.current.setFeatureState( { source: contract_id, id: i*100 + j },{ hover: isExtendedX } );

            
        }
        if(type === 'y'){
            const AreaDirection = currentArea.y - firstArea.y
            const CellDirection = AreaDirection === 0 ? endY - startY : AreaDirection
            const hoverDirection = currentArea.y - lastArea.y || endY - lastY
            const isExtendedY = CellDirection * hoverDirection > 0
            const isOverArea = lastArea.y - currentArea.y
            const _end_y = isExtendedY ? endY : hoverDirection > 0 ? endY-1 : endY+1
            const _start_y = isOverArea!==0 ? (hoverDirection>0 ? 0 : 99) : (isExtendedY ? (hoverDirection>0 ? lastY+1 : lastY-1) : lastY)
            const end_y = _end_y > _start_y ? _end_y : _start_y
            const start_y = _end_y < _start_y ? _end_y : _start_y
            const _start_x = firstArea.x === currentArea.x ? selectedCell.properties.x : 0
            const _end_x = me ? (isExtendedY ? endX : lastX) : 99

            const start_x= _end_x > _start_x ? _start_x : _end_x
            const end_x = _end_x < _start_x ? _start_x : _end_x
            
            
            //
            for(let x = start_x; x <= end_x; x++)
                for(let y = start_y; y <= end_y; y++)
                    map.current.setFeatureState( { source: contract_id, id: x*100 + y },{ hover: isExtendedY } );

        }
        if(type === 'me'){
            console.log('me')
        }
    }
    const findArea = (contract_id)=>{
        for(let i=0; i<3; i++){
            for(let j=0; j<3; j++)
                if(loadedArea[j][i] === contract_id)
                    return {x:i, y:j}
        }
    }

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
                'fill-color': '#000000',//'#627BC1',
                'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    1.0,
                    0.0
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
                const currentCell = e.features[0]

                if(lastCell === null);
                else if(currentCell.id === lastCell.id && currentCell.source === lastCell.contract_id)
                    return;
                
                if(!selectedCell){
                    if(lastCell !== null)
                        map.current.setFeatureState( { source: lastCell.contract_id, id: lastCell.id }, { hover: false } );
                    
                    map.current.setFeatureState( { source: contract_id, id: currentCell.id },{ hover: true } );
                }else{
                    
                    moveEvent(currentCell)
                    /*
                    let {x:startX,y:startY} = selectedCell.properties
                    if(selectedCell.source !== currentCell.source)
                        startX=0
                    const { x:endX,  y:endY } = e.features[0].properties
                    const {x:lastX, y:lastY } = hoveredCell.properties
                    const isExtendedX = Math.abs(startX - endX) - Math.abs(startX - lastX) > 0 ? true : false
                    const isExtendedY = Math.abs(startY - endY) - Math.abs(startY - lastY) > 0 ? true : false
                    const totalSelected = (Math.abs(startX-endX)+1)*(Math.abs(startY-endY)+1)
                    setProps('tempCount', totalSelected)

                    if (lastCell !== null){
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

*/
                }
                lastCell = {contract_id, id: e.features[0].id, x:e.features[0].properties.x, y:e.features[0].properties.y}
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
            for(let i=0; i<9; i++){
                const x = i%3
                const y = Math.floor(i/3,0)
                const contractID = loadedArea[y][x]
                load(contractID)
            }


            
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
