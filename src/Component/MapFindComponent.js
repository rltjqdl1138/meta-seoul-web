
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
    let markers = []
    let seq = 0
    let lastSeq = null
    const saveToFile = async ()=>{
        const date = Date.now()
        const FeatureCollection = {
            type: 'geojson',
            data:{
                "type": "FeatureCollection",
                "features":[]
            }
        }

        for( let ind in history){
            const item = history[ind]
            const center = item.geometry.coordinates[0].reduce((prev, e)=>{
                const [lng, lat] = e
                prev.lng = prev.lng + lng
                prev.lat = prev.lat + lat
                return prev
            },{lng:0, lat:0})

            const count = item.geometry.coordinates[0].length
            center.lng = center.lng / count
            center.lat = center.lat / count

            const feature = {
                "id": `${date}-${ind}`,
                "type":"Feature",
                "properties":{
                    center:[center.lng, center.lat]
                },
                "geometry":{
                    "type":"Polygon",
                    "coordinates":item.geometry.coordinates 
                },
            }
            FeatureCollection.data.features.push(feature)
        }
        const {data} = await  axios.post('/v1/area', FeatureCollection, {
            "Content-Type" : "application/json"
        })
        const source = map.current.getSource('preload')
        source.setData(data.data)
        const current = map.current.getSource('currentLoad')
        current.setData({
            "type": "FeatureCollection",
            "features":[]
        })
    }
    const register = (coordinates)=>{
        markers.forEach( e => e.remove() )
        const featrue = {
            "id": seq++,
            "type":"Feature",
            "properties":{},
            "geometry":{
                "type":"Polygon",
                "coordinates":[ [...coordinates, coordinates[0]] ]
            },
        }
        history.push(featrue)
        const prev = map.current.getSource("currentLoad")
        !prev ? map.current.addSource('currentLoad',{
                type: 'geojson',
                data:{
                    "type": "FeatureCollection",
                    "features":history
                }
            }) :
            prev.setData({
                "type":     "FeatureCollection",
                "features": history
            })

        if(!prev){

            map.current.addLayer({
                id:         'current-fills',
                type:       'fill',
                source:     'currentLoad',
                layout:     {},
                paint:      {
                    'fill-color': '#627BC1',//'#627BC1',
                    'fill-opacity': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        0.7,
                        0.2
                    ]
                }
            });
            
            map.current.addLayer({
                'id': 'current-borders',
                'type': 'line',
                'source':     'currentLoad',
                'layout': {},
                'paint': {
                    'line-color': '#627BC1',
                    'line-width': 1
                }
            });
        
            map.current.on('mousemove', 'current-fills', e => {
                if (e.features.length > 0) {
                    const currentCell =  e.features[0]
                    lastSeq = currentCell.id
                    map.current.setFeatureState( { source:'currentLoad', id:currentCell.id }, { hover: true } );
                        
                }
            });
            map.current.on('mouseleave', 'current-fills', () => {
                if(lastSeq !== null)
                    map.current.setFeatureState( { source:'currentLoad', id:lastSeq }, { hover: false } );
                lastSeq = null
            });
        }

        
        
    }
    
    const undo = ()=>{
        if(history.length === 0) return;
        history = history.slice(0, history.length-1)
        
        const source = map.current.getSource('currentLoad')
        source.setData({
            "type": "FeatureCollection",
            "features":history
        })
    }
    const preLoad = async()=>{


        const {data} = await  axios.get('/v1/area', {
            "Content-Type" : "application/json"
        })
        let ss = map.current.getSource('preload')
        if( !ss ) map.current.addSource('preload', data)
        else ss.setData(data);

        if(!ss){
            map.current.addLayer({
                id:         'preload-fills',
                type:       'fill',
                source:     'preload',
                layout:     {},
                paint:      {
                    'fill-color': '#627BC1',//'#627BC1',
                    'fill-opacity': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        0.7,
                        0.2
                    ]
                }
            });
            
            map.current.addLayer({
                'id': 'preload-borders',
                'type': 'line',
                'source': 'preload',
                'layout': {},
                'paint': {
                    'line-color': '#627BC1',
                    'line-width': 1
                }
            });
        }
    }
    
    const styles = [
        'mapbox://styles/mapbox/streets-v11',
        'mapbox://styles/mapbox/outdoors-v11',
        "mapbox://styles/mapbox/light-v10",
        "mapbox://styles/mapbox/dark-v10",
        'mapbox://styles/mapbox/satellite-v9',
        'mapbox://styles/mapbox/satellite-streets-v11',
        'mapbox://styles/mapbox/navigation-day-v1',
        'mapbox://styles/mapbox/navigation-night-v1',
    ]
    useEffect(() => {
        if (map.current) return;
        map.current = new mapboxgl.Map({
            container:mapContainer.current,
            style:   styles[0],
            doubleClickZoom:false,
            center:   [lng, lat],
            zoom:     zoom
        });
        map.current.on('load',()=>{
            preLoad()
            window.addEventListener('keydown', function(event) {
                const key = event.key;
                switch(key){
                    case 'd':
                        markers.forEach(e => e.remove())
                        selected = []
                        break;
                    case 's':
                        register(selected)
                        selected = []
                        break;
                    case 'z':
                        undo()
                        break;
                    case 'Enter':
                        saveToFile()
                        break;
                    default:
                        console.log(key)
                }
            });

            map.current.on('click', e => {
                if(lastSeq !== null){
                    console.log(history[lastSeq])
                }else{
                    const {lng, lat} = e.lngLat
                    selected.push([lng,lat])
                    const marker = new mapboxgl.Marker()
                        .setLngLat([lng, lat])
                        .addTo(map.current);
                    markers.push(marker)
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
