import React from 'react';
import axios from 'axios'

class TestContainer extends React.Component{
    constructor(props){
        super(props)
        this.state = {list:[]}
    }
    accessToken = null
    componentDidUpdate(prevProps, prevState){
        if(this.accessToken !== null ) return
        this.load(prevProps)
    }

    async load(props){
        const auth = props.auth || {}
        const {address, accessToken} = auth
        if(!address || !accessToken) return;
        this.accessToken = accessToken
        const {data} = await axios.get("/v1/image",{headers: {'Authorization':`Bearer ${accessToken}`}})
        const {assets} = data
        console.log(assets)
        this.setState({list:assets})
    }
    render(){
        const {list} = this.state
        const Comp = list.length && list.map( e =>
            (<div key={e.id}>
                <a href={e.permalink}> <img style={{width:600}} src={e.image_url}/> </a>
            </div>)
        )
        return (
            <div>
                {Comp}
            </div>
        )
    }
}

export default TestContainer