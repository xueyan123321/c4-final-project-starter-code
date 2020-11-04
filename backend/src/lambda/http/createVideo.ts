import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateVideoRequest } from '../../requests/CreateVideoRequest'

import { createVideo } from '../../businessLogic/videos'

import { getUserId  } from '../utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const newVideo: CreateVideoRequest = JSON.parse(event.body)
  const userId = getUserId(event)
  const video = await createVideo(newVideo, userId)
  
  return {
    statusCode: 201,
    headers:{
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item: video
    })
  }
}
