
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import axios from 'axios'
mapboxgl.accessToken = 'pk.eyJ1Ijoicmx0anFkbDExMzgiLCJhIjoiY2t6ZHVrOXFxMDZpODJ2cDJidHh2cmZ6aCJ9.N39L45pDFuKBS5OuX0GBXg';

function MapComponent({onSelect, setProps, total}) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(126.97841);
    const [lat, setLat] = useState(37.56667);
    const [zoom, setZoom] = useState(15);
    
    let loadedArea = [
        [
        ],
        [
        ],
        [   
        ],
    ]
    let lastCell = null
    let hoveredCell = null
    let selectedCell = null
    const changeLocation = async (lng, lat)=>{
        try{
            const {data} = await axios.get(`/v1/area?lng=${lng}&lat=${lat}`)
            const {list} = data
            const loaded = loadedArea.flatMap(e=>e)

            const newLoadedArea = [[],[],[]]
            for(let i=0; i<3; i++)
                for(let j=0; j<3; j++){
                    if(!list[i][j]) continue;
                    newLoadedArea[i][j] = list[i][j].contract_id
                    try{
                        const source = map.current.getSource(list[i][j].contract_id)
                        if(!source){
                            load(list[i][j].contract_id)
                        }
                        else{
                            const ind = loaded.findIndex( e => e === list[i][j].contract_id)
                            loaded.splice(ind, 1)
                        }
                    }
                    catch(e){
                    }
                }
            loadedArea = newLoadedArea
            loaded.forEach( e => {
                map.current.removeLayer(e+"-fills")
                map.current.removeLayer(e+"-selected")
                map.current.removeLayer(e+"-borders")

                map.current.removeSource(e)
            } )
            //console.log(list)
        }catch(e){
            console.log(e)
        }
    }
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
        const first = contract_id === selectedCell.source ? true : false
        const me = contract_id === currentCell.source ? true : false

        const firstArea = findArea(selectedCell.source)
        const currentArea = findArea(contract_id)
        const lastArea = findArea(lastCell.contract_id)
        const endArea = findArea(currentCell.source)

        let {x:startX,y:startY} = selectedCell.properties
        const { x:endX,  y:endY } = currentCell.properties
        const {x:lastX, y:lastY } = lastCell
        //console.log('======================================================')
        if(type === 'x'){
            const AreaDirectionY = endArea.y - firstArea.y
            const AreaDirection = endArea.x - firstArea.x
            const CellDirection = AreaDirection === 0 ? endX - startX : AreaDirection
            const hoverDirection = endArea.x - lastArea.x || endX - lastX
            const hoverDirectionY = endArea.y - lastArea.y || endY - lastY
            const isExtendedX = CellDirection * hoverDirection > 0
            const isOverArea = endArea.x - lastArea.x
            const isOverAreaY = endArea.y - lastArea.y
            const _end_x = isExtendedX ? endX : hoverDirection > 0 ? endX-1 : endX+1
            const _start_x = isOverArea!==0 ? (hoverDirection>0 ? 0 : 99) : (isExtendedX ? (hoverDirection>0 ? lastX+1 : lastX-1) : lastX)

            const end_x = Math.min(_end_x > _start_x ? _end_x : _start_x, 99)
            const start_x = _end_x < _start_x ? _end_x : _start_x

            let _start_y, _end_y
            if(AreaDirectionY === 0){
                _start_y = selectedCell.properties.y
                _end_y = (isExtendedX ? endY : hoverDirectionY>0 ? Math.min(endY, lastY):Math.max(endY, lastY))
            }
            else if(firstArea.y === currentArea.y){
                _start_y = AreaDirectionY > 0 ? 99 : 0
                _end_y = startY
            }else if(lastArea.y === currentArea.y){
                _start_y = AreaDirectionY > 0 ? 0 : 99
                _end_y = (isExtendedX ? endY : hoverDirectionY>0 ? Math.min(endY, lastY):Math.max(endY, lastY))
            }else{
                _start_y = 0
                _end_y = 99
            }



            const start_y = _end_y > _start_y ? _start_y : _end_y
            const end_y = _end_y < _start_y ? _start_y : _end_y
            if(me && first && start_x <= startX && end_x >= startX){
                /*
                console.log(currentArea)
                console.log({CellDirection, hoverDirection, isExtendedX,isOverArea,isOverAreaY})
                console.log(selectedCell)
                console.log(lastCell)
                console.log(currentCell)
                console.log(currentArea)
                console.log(lastArea)
                console.log(endArea)*/
                const st_y = Math.min(lastY, startY, endY)
                const en_y = Math.max(lastY, startY, endY)
                if(hoverDirection > 0){
                    console.log(`X:${start_x}~${end_x} Y:${start_y}~${end_y}`)
                    console.log(`${start_x-1}~${startX-1}, ${st_y}~${en_y}`)
                    console.log(`${startX}~${end_x},${start_y}~${end_y}`)
                    console.log(startX, lastX, endX)
                    console.log(startY, lastY, endY)
                    SetSelection(contract_id, start_x-1, startX-1, st_y, en_y, false)
                    SetSelection(contract_id, startX, end_x, start_y, end_y, true)
                }
                else{
                    SetSelection(contract_id, startX+1, end_x+1, st_y, en_y, false)
                    SetSelection(contract_id, start_x, startX, start_y, end_y, true)
                }
            }else
                SetSelection(contract_id, start_x, end_x, start_y, end_y, isExtendedX)

            if(isOverArea < 0 && currentArea.x === lastArea.x-1){
                const preCell = loadedArea[currentArea.y][lastArea.x]
                if(!isExtendedX){
                    for(let i=0; i<=lastX; i++)
                        for(let j=start_y; j<=end_y; j++)
                            map.current.setFeatureState( { source: preCell, id: i*100 + j },{ hover: false} );
                }
                else{
                    for(let i=0; i<=lastX; i++)
                        for(let j=start_y; j<=end_y; j++)
                            map.current.setFeatureState( { source: preCell, id: i*100 + j },{ hover: true } );
                }
            }else if(isOverArea > 0 && currentArea.x === lastArea.x+1){
                const preCell = loadedArea[currentArea.y][lastArea.x]
                if(!isExtendedX){
                    for(let i=lastX; i<=99; i++)
                        for(let j=start_y; j<=end_y; j++)
                            map.current.setFeatureState( { source: preCell, id: i*100 + j },{ hover: false } );
                }
                else{
                    for(let i=lastX; i<=99; i++)
                        for(let j=start_y; j<=end_y; j++)
                            map.current.setFeatureState( { source: preCell, id: i*100 + j },{ hover: true} );   
                } 
            }else{
            }


        
        }
        if( type === 'y'){
            const AreaDirectionX = endArea.x - firstArea.x
            const AreaDirection = endArea.y - firstArea.y
            const CellDirection = AreaDirection === 0 ? endY - startY : AreaDirection
            const hoverDirection = endArea.y - lastArea.y || endY - lastY
            const hoverDirectionX = endArea.x - lastArea.x || endX - lastX
            const isExtendedY = CellDirection * hoverDirection > 0
            const isOverArea = endArea.y - lastArea.y
            const isOverAreaX = endArea.x - lastArea.x
            const _end_y = isExtendedY ? endY : hoverDirection > 0 ? endY-1 : endY+1
            const _start_y = isOverArea!==0 ? (hoverDirection>0 ? 0 : 100) : (isExtendedY ? (hoverDirection>0 ? lastY+1 : lastY-1) : lastY)

            const end_y = _end_y > _start_y ? _end_y : _start_y
            const start_y = _end_y < _start_y ? _end_y : _start_y


            let _start_x, _end_x
            if(AreaDirectionX === 0){
                _start_x = selectedCell.properties.x
                _end_x = (isExtendedY ? endX : hoverDirectionX>0 ? Math.min(endX, lastX):Math.max(endX, lastX))
            }
            else if(firstArea.x === currentArea.x){
                _start_x = AreaDirectionX > 0 ? 99 : 0
                _end_x = startX
            }else if(lastArea.x === currentArea.x){
                _start_x = AreaDirectionX > 0 ? 0 : 99
                _end_x =  (isExtendedY ? endX : hoverDirectionX>0 ? Math.min(endX, lastX):Math.max(endX, lastX))
            }else{
                _start_x = 0
                _end_x = 99
            }

            const start_x = _end_x > _start_x ? _start_x : _end_x
            const end_x = _end_x < _start_x ? _start_x : _end_x

            /*
            console.log(currentArea)
            console.log({CellDirection, hoverDirection, isExtendedY,isOverArea,isOverAreaX})
            console.log(selectedCell)
            console.log(lastCell)
            console.log(currentCell)
            console.log(currentArea)
            console.log(lastArea)
            console.log(endArea)
            console.log(`X:${start_x}~${end_x} Y:${start_y}~${end_y}`)
            */
            
            if(me && first && start_y <= startY && end_y >= startY){
                const st_x = Math.min(lastX, startX, endX)
                const en_x = Math.max(lastX, startX, endX)
                if(hoverDirection > 0){
                    console.log(`${st_x-1}~${en_x}, ${start_y}~${startY-1}`)
                    console.log(`${start_x}~${end_x},${startY}~${end_y}`)
                    console.log(startX, lastX, endX)
                    console.log(startY, lastY, endY)
                    SetSelection(contract_id, st_x, en_x, start_y-1, startY-1,  false)
                    SetSelection(contract_id, start_x, end_x, startY, end_y,  true)
                }
                else{
                    SetSelection(contract_id, st_x, en_x, startY+1, end_y+1, false)
                    SetSelection(contract_id, start_x, end_x, start_y, startY, true)
                }
            }else
                SetSelection(contract_id, start_x, end_x, start_y, end_y, isExtendedY)

            const preCell = loadedArea[lastArea.y][currentArea.x]
            if(isOverArea < 0 && currentArea.y === lastArea.y-1){
                if(!isExtendedY){
                    for(let j=0; j<=lastY; j++)
                        for(let i=start_x; i<=end_x; i++)
                            map.current.setFeatureState( { source: preCell, id: i*100 + j },{ hover: false} );
                }
                else{
                    const preCell = loadedArea[lastArea.y][currentArea.x]
                    for(let j=0; j<=lastY; j++)
                        for(let i=start_x; i<=end_x; i++)
                            map.current.setFeatureState( { source:preCell, id: i*100 + j },{ hover: true } );
                }
            }else if(isOverArea > 0 && currentArea.y === lastArea.y+1){
                if(!isExtendedY){
                    for(let j=lastY; j<=99; j++)
                        for(let i=start_x; i<=end_x; i++)
                            map.current.setFeatureState( { source: preCell, id: i*100 + j },{ hover: false } );
                }
                else{
                    for(let j=lastY; j<=99; j++)
                        for(let i=start_x; i<=end_x; i++)
                            map.current.setFeatureState( { source:preCell, id: i*100 + j },{ hover: true} );    
                }
            }
            

        }
        
        //console.log('======================================================')
    }
    const SetSelection = (contract_id, x1, x2, y1, y2, hover)=>{
        for(let j=y1; j<=y2; j++)
            for(let i=x1; i<=x2; i++)
                map.current.setFeatureState( { source:contract_id, id: i*100 + j },{ hover} );    
    }
    const findArea = (contract_id)=>{
        for(let i=0; i<3; i++){
            for(let j=0; j<3; j++)
                if(loadedArea[j][i] === contract_id)
                    return {x:i, y:j}
        }
    }

    const load =(contract_id)=>{
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
            console.log(contract_id)
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
                }
                lastCell = {contract_id, id: e.features[0].id, x:e.features[0].properties.x, y:e.features[0].properties.y}
                hoveredCell = e.features[0]
            }
        });

        map.current.on('mouseleave', contract_id+'-fills', () => {
            if(!selectedCell){
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

            map.current.on('wheel', e=>{
                setProps('zoom', map.current.getZoom().toFixed(4))
            })
            setProps("clearMap", ({contract_id, id})=>{
                console.log(contract_id, id)
                map.current.setFeatureState( { source:contract_id, id },{ hover: false, selected:false } );
            })
                
            map.current.on('moveend', ({target})=>{
                const {lng, lat} = target.transform._center
                changeLocation(lng, lat)
            })
    
            map.current.addSource('jungu', {
                type:'geojson',
                data:`/jungu.json`
            });
            map.current.addLayer({
                id:         'jungu-fills',
                type:       'fill',
                source:     'jungu',
                layout:     {},
                paint:      {
                    'fill-color': '#800000',//'#627BC1',
                    'fill-opacity': 0.1
                }
            });
            
            map.current.addLayer({
                'id': 'jungu-borders',
                'type': 'line',
                source:     'jungu',
                'layout': {},
                'paint': {
                'line-color': '#800000',
                'line-width': 1
                }
            });


            
            map.current.on('click', (e) => {
                if(!selectedCell){
                    selectedCell = hoveredCell
                }
                else{
                    const {x:startX,y:startY} = selectedCell.properties
                    const {x:endX, y:endY} = hoveredCell.properties
                    const firstArea = findArea(selectedCell.source)
                    const endArea = findArea(hoveredCell.source)



                    const _start_x = startX + firstArea.x * 100
                    const _start_y = startY + firstArea.y * 100

                    const _end_x = endX + endArea.x * 100
                    const _end_y = endY + endArea.y * 100
                    
                    const start_x = Math.min(_start_x, _end_x)
                    const end_x = Math.max(_start_x, _end_x)
                    const start_y = Math.min(_start_y, _end_y)
                    const end_y = Math.max(_start_y, _end_y)

                    const list = []

                    for(let x=start_x; x<=end_x; x++)
                        for(let y=start_y; y<=end_y; y++){
                            const AreaX = x<100 ? 0 : x<200 ? 1 : 2
                            const AreaY = y<100 ? 0 : y<200 ? 1 : 2
                            const contract_id = loadedArea[AreaY][AreaX]
                            if( total() <= 200){
                                map.current.setFeatureState( { source: contract_id, id: (x%100)*100 + y%100 },{ hover: false, selected:true } );
                                list.push({id: (x%100)*100 + y%100 , x, y, contract_id})
                            }else
                                map.current.setFeatureState( { source: contract_id, id: (x%100)*100 + y%100 },{ hover: false } );
                        }
                    selectedCell = null
                    onSelect(list)
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
