const fs = require('fs')
const mysql = require('mysql')
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1138877",
    database: "seoul_test"
});

/*
area width  (lng) = 0.018622
area height (lat)=   0.015323
*/
  
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query('select * from area_info', (err, result)=>{
        result.forEach( async (e) => {
            const data = await createFeatureCollection(e)
            console.log(e.contract_id)
            fs.writeFileSync(`./public/${e.contract_id}.json`, JSON.stringify(data))
        })
    })
});


function createFeatureCollection({contract_id, lng_start, lat_start, lng_end, lat_end, count_x, count_y}){
    return new Promise((resolve, reject)=>{

        const LNG_SIZE = (lng_end - lng_start) / count_x
        const LAT_SIZE = (lat_end - lat_start) / count_y
        console.log(contract_id)
        const list = []
        con.query(`
    select *
    from (
        select 
            ai.contract_id as contract_id,
            ai.lng_start as lng_start,
            ai.lat_start as lat_start,
            ai.count_x as count_x,
            ai.count_y as count_y,
            ai.lng_end as lng_end,
            ai.lat_end as lat_end,
            asi.seq as seq,
            asi.token_id as token_id,
            asi.coordinate_x as coordinate_x,
            asi.coordinate_y as coordinate_y,
            asi.tier as tier
        from area_info ai, asset_info asi
        where ai.contract_id="${contract_id}" and ai.contract_id = asi.contract_id
    ) a
    inner join ownership o on a.seq = o.asset_seq`, (err, result)=>{
            console.log(result.length)
            for(let i=0; i<result.length; i++)
                list.push(createFeature(result[i], LNG_SIZE, LAT_SIZE, lng_start, lat_start))
            resolve(
                /*
                {
                    type: 'geojson',
                    data: {
                        "type":"FeatureCollection",
                        "features": list
                    }
                }*/
                {
                    "type":"FeatureCollection",
                    "features": list
                }
            )
        })
            

    })
}
function createFeature(data, size_x, size_y, start_x, start_y){
    const { contract_id, token_id, coordinate_x:x, coordinate_y:y, location, tier, wallet_address, price} = data
    
    // 실제 1km당 x/110.941
    const x_size = size_x
    const y_size = size_y
    const START_X = start_x
    const START_Y = start_y
    
    const x_pos = START_X + x * x_size
    const y_pos = START_Y + y * y_size
    return {
        'id': 100*x + y,
        'type': 'Feature',
        'properties': {
            location, tier, x, y, price, wallet: wallet_address, asset_id:`${contract_id}:${token_id}`
        },
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