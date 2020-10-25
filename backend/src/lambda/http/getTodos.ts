import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
// import * as AWS  from 'aws-sdk'
import { getUserId } from '../utils'
import { getUserTodos  } from '../../businessLogic/todos'

// const docClient = new AWS.DynamoDB.DocumentClient()
// const toDosTable = process.env.TODOS_TABLE

//@ts-ignore
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  const userId = getUserId(event);
  const items = await getUserTodos(userId);

  return {
    statusCode: 200,
    headers:{
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }
}
