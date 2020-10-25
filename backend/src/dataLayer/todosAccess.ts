import { TodoItem } from '../models/TodoItem';
import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';

import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS);
const logger = createLogger('todosAccess');

export class TodosAccess {
    constructor(
        private readonly docClient: AWS.DynamoDB.DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly s3 = new XAWS.S3({
            signatureVersion: 'v4'
          }),
        private readonly todosTable = process.env.TODOS_TABLE,
    ){}

    async getUserTodos(userId: string){
        const result = await this.docClient.query({
            TableName: this.todosTable,
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

    async updateTodo(userId: string, todoId: string, todoBody: UpdateTodoRequest){
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                userId,
                todoId
            },
            UpdateExpression: "SET done = :done",
            ExpressionAttributeValues: {
                ":done": todoBody.done
            }
        }).promise()
    }

    async deleteTodo(userId: string, todoId: string){
        await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                userId,
                todoId
            }
        }).promise()
    }

    async getUploadUrl(userId: string, todoId: string){
        const uploadUrl = this.s3.getSignedUrl('putObject', {
            Bucket: process.env.ATTACHMENTS_BUCKET,
            Key: todoId,
            Expires: Number(process.env.SIGNED_URL_EXPIRATION)
          });
        logger.info(uploadUrl);
        await this.docClient.update({
            TableName: this.todosTable,
            Key: { userId, todoId },
            UpdateExpression: "set attachmentUrl=:URL",
            ExpressionAttributeValues: {
              ":URL": uploadUrl.split("?")[0]
          },
          ReturnValues: "UPDATED_NEW"
        })
        .promise();
        return uploadUrl
    }
}