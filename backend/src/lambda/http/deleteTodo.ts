import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { deleteTodo } from '../../businessLogic/todos'

import { getUserId  } from '../../lambda/utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  //@ts-ignore
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  // TODO: Remove a TODO item by id
  await deleteTodo(userId, todoId);

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: 'delete successfully'
  }
}
