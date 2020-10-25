import { TodoItem } from '../models/TodoItem';
import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';

const XAWS = AWSXRay.captureAWS(AWS);

export class TodosAccess {
    constructor(
        private readonly docClient: AWS.DynamoDB.DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly userIdIndex = process.env.USER_ID_INDEX
    ){}
    //@ts-ignore
    async getUserTodos(userId: string): AWS.DynamoDB.DocumentClient.ItemList {
        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.userIdIndex,
            KeyConditionExpression: "userId =:userId",
            ExpressionAttributeValues:{
              ":userId": userId
            }
          }).promise();
        return result.Items
    }

    async createToDo(todoItem: TodoItem){
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem
        }).promise();

        return todoItem;
    }

    async updateTodo(todoId: string, todoBody: UpdateTodoRequest){
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                "todoId": todoId,
            },
            UpdateExpression: "SET done = :done",
            ExpressionAttributeValues: {
                ":done": todoBody.done
            }
        }).promise()
    }

    async deleteTodo(todoId: string){
        await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                "todoId": todoId
            }
        }).promise()
    }
}