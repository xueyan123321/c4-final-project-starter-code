import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

import { updateTodo } from '../../businessLogic/todos'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodoBody: UpdateTodoRequest = JSON.parse(event.body)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  await updateTodo(updatedTodoBody, todoId)
  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: 'update successfully'
  }
}
