
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

    let hoveredCell = null
    
    
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

        
        map.current.on('mousemove', 'preload-fills', e => {
            if(e.features.length === 0) return;
            if(hoveredCell !== null)
                    map.current.setFeatureState( { source:'preload', id:hoveredCell.id }, { hover: false } );
            hoveredCell = e.features[0]
            map.current.setFeatureState( { source:'preload', id:hoveredCell.id}, { hover: true } );
            
        });
        map.current.on('mouseleave', 'preload-fills', () => {
            if(hoveredCell !== null)
                map.current.setFeatureState( { source:'preload', id:hoveredCell.id }, { hover: false } );
            hoveredCell = null
        });
    } 
   
    function mouseEvent(){
        map.current.on('click', e => {
            if(hoveredCell !== null){
                let center = hoveredCell.properties.center
                center = center.replace("[","").replace("]","").split(",")
                console.log(center)
                setProps('selectedCell', {id:hoveredCell.id, center, price:0.1, properties:hoveredCell.properties})
            }
            
        });
    }
    async function update(){
        const {data:body} = await  axios.get('/v1/area', { "Content-Type" : "application/json" })
        const source = map.current.getSource('preload')
        source.setData( body.data )
    }
    const height = `${window.innerHeight-66}px`
    return (
        <div>
            <div style={{width:"100%", height}} ref={mapContainer} className="map-container" />
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
