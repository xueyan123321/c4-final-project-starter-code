import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

import { createTodo } from '../../businessLogic/todos'

import { getUserId  } from '../../lambda/utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const userId = getUserId(event)
  const todo = await createTodo(newTodo, userId)
  // TODO: Implement creating a new TODO item
  return {
    statusCode: 201,
    headers:{
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item: todo
    })
  }
}
