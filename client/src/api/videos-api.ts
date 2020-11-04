import { apiEndpoint } from '../config'
import { Video } from '../types/video';
import { CreateVideoRequest } from '../types/CreateTodoRequest';
import Axios from 'axios'
import { UpdateVideoRequest } from '../types/UpdateVideoRequest';

export async function getVideos(idToken: string): Promise<Video[]> {
  console.log('Fetching user Videos')

  const response = await Axios.get(`${apiEndpoint}/videos`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('videos:', response.data)
  return response.data.items
}

export async function createVideo(
  idToken: string,
  newVideo: CreateVideoRequest
): Promise<Video> {
  const response = await Axios.post(`${apiEndpoint}/videos`,  JSON.stringify(newVideo), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchVideo(
  idToken: string,
  videoId: string,
  updatedTodo: UpdateVideoRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/videos/${videoId}`, JSON.stringify(updatedTodo), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteVideo(
  idToken: string,
  videoId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/videos/${videoId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  videoId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/videos/${videoId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  console.log(response)
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
