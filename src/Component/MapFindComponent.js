
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

    let seq = 0
    let hoveredCellID = null

    let selected = []
    let history = []
    let markers = []


    useEffect(() => {
        if (map.current) return;
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style:     styles[0],
            doubleClickZoom: false,
            center:   [lng, lat],
            zoom:     zoom
        });

        map.current.on('load',()=>{
            LoadLayer()
            update()
            keyboardEvent()
            mouseEvent()
        })
    });
    
    /*
     * 1. Initialize
    **/
    function LoadLayer(){
        map.current.addSource('preload', DEFAULT_SOURCE)
        map.current.addLayer(PRELOAD_FILL_LAYER);
        map.current.addLayer(PRELOAD_BORDER_LAYER);

        map.current.addSource('current', DEFAULT_SOURCE)
        map.current.addLayer(CURRENT_FILL_LAYER);
        map.current.addLayer(CURRENT_BORDER_LAYER);
        
        map.current.on('mousemove', 'current-fills', e => {
            if(e.features.length === 0) return;
            if(hoveredCellID !== null)
                    map.current.setFeatureState( { source:'current', id:hoveredCellID }, { hover: false } );
            map.current.setFeatureState( { source:'current', id:(hoveredCellID = e.features[0].id)}, { hover: true } );
            
        });
        map.current.on('mouseleave', 'current-fills', () => {
            if(hoveredCellID !== null)
                map.current.setFeatureState( { source:'current', id:hoveredCellID }, { hover: false } );
            hoveredCellID = null
        });
    } 
   function keyboardEvent(){
       window.addEventListener('keydown',({key})=>{
           switch(key){
               case 'd':       del(); break;
               case 's':       add(selected); break;
               case 'z':       undo(); break;
               case 'Enter':   upload(); break;
           }
       });
   }
   
   function mouseEvent(){
       map.current.on('click', e => {
           if(hoveredCellID !== null){
               console.log(history[hoveredCellID])
           }
           else{
               const {lng, lat} = e.lngLat
               selected.push([lng,lat])
               const marker = new mapboxgl.Marker()
                   .setLngLat([lng, lat])
                   .addTo(map.current);
               markers.push(marker)
           }
           
       });
   }

    /*
     * 2. Local functions
    **/
    function add(coordinates){
        const featrue = {
            id:     seq++,
            type:   "Feature",
            properties:{ },
            geometry:{
                type:   "Polygon",
                coordinates:[ [...coordinates, coordinates[0]] ]
            },
        }
        
        history.push(featrue)
        map.current.getSource("current").setData({ type:"FeatureCollection", features:history})

        markers.forEach( e => e.remove() )
        selected = []
    }

    function undo(){
        if(history.length === 0) return;
        map.current.getSource('current').setData({
            "type": "FeatureCollection",
            "features": history = history.slice(0, history.length-1)
        })
    }

    function del(){
        markers.forEach(e => e.remove())
        selected = []
    }

    /*
     * 3. Upload / Download
    **/
    async function upload(){
        if( !window.confirm(`타일 ${history.length}개를 업로드합니다.`) ) return;
        const date = Date.now()
        const FeatureCollection = {...DEFAULT_SOURCE}

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
                id: `${date}-${ind}`,
                type: "Feature",
                properties:{
                    center:[center.lng, center.lat]
                },
                geometry:{ type:"Polygon", coordinates:item.geometry.coordinates },
            }
            FeatureCollection.data.features.push(feature)
        }
        const {data:body} = await  axios.post('/v1/area', FeatureCollection, { "Content-Type" : "application/json" })
        history = []
        map.current.getSource('preload').setData(body.data)
        map.current.getSource('current').setData({"type": "FeatureCollection","features":[]})
    }

    async function update(){
        const {data:body} = await  axios.get('/v1/area', { "Content-Type" : "application/json" })
        const source = map.current.getSource('preload')
        source.setData( body.data )
    }

    return (
        <div>
            <div style={{width:"100%", height:"814px"}} ref={mapContainer} className="map-container" />
        </div>
    );
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

const PRELOAD_FILL_LAYER = {
    id:         'preload-fills',
    type:       'fill',
    source:     'preload',
    layout:     {},
    paint:      {
        'fill-color': '#627BC1',//'#627BC1',
        'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.7, 0.2
        ]
    }
}
const CURRENT_FILL_LAYER = {
    id:         'current-fills',
    type:       'fill',
    source:     'current',
    layout:     {},
    paint:      {
        'fill-color': '#990F02',//'#627BC1',
        'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.7, 0.2
        ]
    }
}

const PRELOAD_BORDER_LAYER = {
    id: 'preload-borders',
    type: 'line',
    source: 'preload',
    layout: {},
    paint: {
        'line-color': '#627BC1',
        'line-width': 1
    }
}

const CURRENT_BORDER_LAYER = {
    id: 'current-borders',
    type: 'line',
    source: 'current',
    layout: {},
    paint: {
        'line-color': '#990F02',
        'line-width': 1
    }
}

const DEFAULT_DATA = { "type": "FeatureCollection", "features":[]}
const DEFAULT_SOURCE = { type: 'geojson', data: DEFAULT_DATA }


export default MapComponent;
