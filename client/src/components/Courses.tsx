import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Grid,
  Header,
  Loader
} from 'semantic-ui-react'

import {  deleteVideo, getVideos, createVideo } from '../api/videos-api'
import Auth from '../auth/Auth'
import { Video } from '../types/video'

interface TodosProps {
  auth: Auth
  history: History
}

interface VideosState {
  videos: Video[]
  title: string
  loadingTodos: boolean
}

export class Todos extends React.PureComponent<TodosProps, VideosState> {
  state: VideosState = {
    videos: [],
    title: '',
    loadingTodos: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ title: event.target.value })
  }

  onEditButtonClick = (videoId: string) => {
    console.log(videoId, 'videoId');
    this.props.history.push(`/videos/${videoId}/edit`)
  }

  //@ts-ignore
  onVideoCreate = async (event) => {
    try {
      const newvideo = await createVideo(this.props.auth.getIdToken(), {
        title: this.state.title
      })
      this.setState({
        videos: [...this.state.videos, newvideo],
        title: ''
      })
    } catch {
      alert('Todo creation failed')
    }
  }

  onVideoDelete = async (videoId: string) => {
    try {
      await deleteVideo(this.props.auth.getIdToken(), videoId)
      this.setState({
        videos: this.state.videos.filter(video => video.videoId != videoId)
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  onEditCourse = async (title: string, videoId: string) => {
    console.log(title, 'title');
    this.props.history.push(`/videos/${videoId}/${title}`);
  }

  async componentDidMount() {
    try {
      const videos = await getVideos(this.props.auth.getIdToken())
      this.setState({
        videos,
        loadingTodos: false
      })
    } catch (e) {
      alert(`Failed to fetch todos: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Courses</Header>

        {this.renderCreateVideoInput()}

        {this.renderVideos()}
      </div>
    )
  }

  renderCreateVideoInput() {
    return (
      <div>
        <input
          placeholder='please input video title...'  
          onChange={this.handleNameChange} 
          style={{
            marginRight: 10,
            width:250
        }}/>
        <Button onClick={this.onVideoCreate}>create new video</Button>
      </div>
    )
  }

  renderVideos() {
    if (this.state.loadingTodos) {
      return this.renderLoading()
    }

    return this.renderVideosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Videos
        </Loader>
      </Grid.Row>
    )
  }

  renderVideosList() {
    return (
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        {this.state.videos.map((video, index) => {
          return (
            <div key={video.videoId} style={{marginRight: '10px', marginTop: '30px'}}>
              <span style={{marginRight: '10px'}}>{video.title}</span>
              {video.attachmentUrl && 
              <div><video width="320" height="240" controls >
                  <source src={video.attachmentUrl}/>
                </video>
              </div>}
              <Button
                  onClick={() => this.onEditButtonClick(video.videoId)}
                >
                  uploadVideos
              </Button>
              <Button
                  onClick={() => this.onEditCourse(video.title, video.videoId)}
              >
                  editCourse
              </Button>
              <Button
                onClick={() => this.onVideoDelete(video.videoId)}
              >deleteCourse</Button>
            </div>
          )
        })}
      </div>
    )
  }
}
