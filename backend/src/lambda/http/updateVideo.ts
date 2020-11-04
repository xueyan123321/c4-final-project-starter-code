import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateVideoRequest } from '../../requests/UpdateTodoRequest'

import { updateVideo } from '../../businessLogic/videos'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const videoId = event.pathParameters.videoId;
  const updatedVideoBody: UpdateVideoRequest = JSON.parse(event.body);

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  await updateVideo(videoId, updatedVideoBody.title);
  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: 'update successfully'
  }
}
