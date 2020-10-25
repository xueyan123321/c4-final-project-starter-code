import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { deleteTodo } from '../../businessLogic/todos'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  //@ts-ignore
  const todoId = event.pathParameters.todoId

  // TODO: Remove a TODO item by id
  await deleteTodo(todoId);

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: 'delete successfully'
  }
}
