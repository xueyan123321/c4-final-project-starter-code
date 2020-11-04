import * as React from 'react'
import Auth from '../auth/Auth'
import { patchVideo } from '../api/videos-api'
import {
    Button
  } from 'semantic-ui-react'

interface EditVideoTitleProp{
    match: {
        params:{
            videoId: string,
            title: string
        }
    },
    auth: Auth
}

interface EditVideoState {
    title: string,
    loading: boolean
}


export class EditTitle extends React.PureComponent<EditVideoTitleProp, EditVideoState>{
    state: EditVideoState = {
        title: '',
        loading: false
    }

    componentDidMount(){
        this.setState({
            title: this.props.match.params.title
        })
    }

    render(){
        const {videoId, title} = this.props.match.params
        return <div>
            <span
                style={{
                    marginRight: '10px'
                }}
            >Title</span>
            <input type="text" value={this.state.title} onChange={(e)=>{
                this.setState({
                    title: e.target.value
                })
            }}/>
            <Button
                loading = {this.state.loading}
                style={{
                    marginLeft: '10px'
                }} 
                onClick={async ()=> {
                    try{
                        await patchVideo(this.props.auth.getIdToken(), videoId, {
                            title: this.state.title
                        })
                        this.setState({
                            loading: true
                        })
                        alert("modify title success");
                    } catch{
                        alert('modify title failed')
                    } finally {
                        this.setState({
                            loading: false
                        })
                    }
            }}>ok</Button>
        </div> 
    }
}