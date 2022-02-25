
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
    let selected = []
    let history = []
    let seq = 0
    let lastSeq = null
    const register = (coordinates)=>{
        const featrue = {
            "id": seq,
            "type":"Feature",
            "properties":{},
            "geometry":{
                "type":"Polygon",
                "coordinates":[ [...coordinates, coordinates[0]] ]
            },
        }
        history.push(featrue)
        const prev = map.current.getSource(String(seq))
        prev && map.current.removeSource(seq)
        seq = seq+1
        const id = String(seq)

        map.current.addSource(id,{
            type: 'geojson',
            data:{
                "type": "FeatureCollection",
                "features":history
            }
        })
        
        map.current.addLayer({
            id:         id+'-fills',
            type:       'fill',
            source:     id,
            layout:     {},
            paint:      {
                'fill-color': '#700000',//'#627BC1',
                'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    1.0,
                    0.2
                ]
            }
        });
        
        map.current.addLayer({
            'id': id+'-borders',
            'type': 'line',
            'source': id,
            'layout': {},
            'paint': {
                'line-color': '#627BC1',
                'line-width': 1
            }
        });
        
        map.current.on('mousemove', id+'-fills', e => {
            if (e.features.length > 0) {
                const currentCell =  e.features[0]
                lastSeq = currentCell.id
                map.current.setFeatureState( { source:id, id:currentCell.id }, { hover: true } );
                    
            }
        });
        map.current.on('mouseleave', id+'-fills', () => {
            if(lastSeq !== null)
                map.current.setFeatureState( { source:id, id:lastSeq }, { hover: false } );
            lastSeq = null
        });
        
    }
    
    const undo = ()=>{
        if(history.length === 0) return;
        history = history.slice(0, history.length-1)
        console.log(seq)
        map.current.removeLayer(String(seq)+'-fills')
        map.current.removeLayer(String(seq)+'-borders')

        map.current.removeSource(String(seq))

        seq = seq - 1
        const id = String(seq)

        map.current.addSource(id,{
            type: 'geojson',
            data:{
                "type": "FeatureCollection",
                "features":history
            }
        })

        map.current.addLayer({
            id:         id+'-fills',
            type:       'fill',
            source:     id,
            layout:     {},
            paint:      {
                'fill-color': '#700000',//'#627BC1',
                'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    1.0,
                    0.2
                ]
            }
        });
        map.current.addLayer({
            'id': id+'-borders',
            'type': 'line',
            'source': id,
            'layout': {},
            'paint': {
                'line-color': '#627BC1',
                'line-width': 1
            }
        });
        
        map.current.on('mousemove', id+'-fills', e => {
            if (e.features.length > 0) {
                const currentCell =  e.features[0]
                lastSeq = currentCell.id
                map.current.setFeatureState( { source:id, id:currentCell.id }, { hover: true } );
                    
            }
        });
        map.current.on('mouseleave', id+'-fills', () => {
            if(lastSeq !== null)
                map.current.setFeatureState( { source:id, id:lastSeq }, { hover: false } );
            lastSeq = null
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
            
            window.addEventListener('keydown', function(event) {
                const key = event.key;
                switch(key){
                    case 'd':
                        selected = []
                        break;
                    case 's':
                        register(selected)
                        selected = []
                        break;
                    case 'z':
                        undo()
                        break;
                }
            });
                
            /*
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
                'id':   'jungu-borders',
                'type': 'line',
                source: 'jungu',
                'layout': {},
                'paint': {
                    'line-color': '#800000',
                    'line-width': 1
                }
            });*/

            map.current.on('click', e => {
                if(lastSeq !== null){
                    console.log(history[lastSeq])
                }else{
                    const {lng, lat} = e.lngLat
                    selected.push([lng,lat])
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
