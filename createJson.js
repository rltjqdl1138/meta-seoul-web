const fs = require('fs')

const data = createFeatureCollection(100,100)
function createFeatureCollection(x, y){
    const list = []
    for(let i=0; i<x; i++)
        for(let j=0; j<y; j++)
            list.push(createFeature(i*y + j, i, j))
        


    const data = {
        type: 'geojson',
        data: {
            "type":"FeatureCollection",
            "features": list
        }
    }
    return data
}
function createFeature(id, x, y){
    // 실제 1km당 x/110.941
    const REAL_SIZE = 17
    const RAT_SIZE = REAL_SIZE * 0.001 /110.941
    
    const ratio = 91.29/110.941
    const x_size = RAT_SIZE
    const y_size = RAT_SIZE * ratio
    const START_X = 126.97841 - 100*x_size/2
    const START_Y = 37.56667 - 100*y_size/2

    const x_pos = START_X + x * x_size
    const y_pos = START_Y + y * y_size
    return {
        'id': id,
        'type': 'Feature',
        'properties': { x, y },
        'geometry': {
          'type': 'Polygon',
          'coordinates': [
                [
                    [x_pos-x_size,  y_pos-y_size  ],
                    [x_pos,         y_pos-y_size  ],
                    [x_pos,         y_pos        ],
                    [x_pos-x_size,  y_pos        ],
                    [x_pos-x_size,  y_pos-y_size  ],
                ]
            ]
        }
    }
}
fs.writeFileSync("./src/data.json", JSON.stringify(data))