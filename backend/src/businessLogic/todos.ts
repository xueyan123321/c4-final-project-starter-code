import * as uuid from 'uuid'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodosAccess } from '../dataLayer/todosAccess'

const todosAccess = new TodosAccess();
const TO_DO_IMAGES_BUCKET = process.env.ATTACHMENTS_BUCKET

export async function getUserTodos(userId:string): Promise<AWS.DynamoDB.DocumentClient.ItemList>{
    return todosAccess.getUserTodos(userId)
}

export async function createTodo(requestBody: CreateTodoRequest, userId: string): Promise<TodoItem>{
    const itemId = uuid.v4();
    return await todosAccess.createToDo({
        todoId: itemId,
        userId,
        createdAt: new Date().toISOString(),
        name: requestBody.name,
        dueDate: requestBody.dueDate,
        done: false,
        attachmentUrl: `https://${TO_DO_IMAGES_BUCKET}.s3.amazonaws.com/${itemId}`
    })
}

export async function updateTodo(updateTodo: UpdateTodoRequest, toDoId: string){
    await todosAccess.updateTodo(toDoId, updateTodo);
}

export async function deleteTodo(todoId: string): Promise<void>{
    await todosAccess.deleteTodo(todoId);
}