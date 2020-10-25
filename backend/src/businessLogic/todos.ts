import * as uuid from 'uuid'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodosAccess } from '../dataLayer/todosAccess'

const todosAccess = new TodosAccess();

export async function getUserTodos(userId:string){
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
        done: false
    })
}

export async function updateTodo(userId: string, updateTodo: UpdateTodoRequest, toDoId: string){
    await todosAccess.updateTodo(userId, toDoId, updateTodo);
}

export async function deleteTodo(userId: string, todoId: string): Promise<void>{
    await todosAccess.deleteTodo(userId, todoId);
}

export async function getUploadUrl(userId: string, todoId: string){
    return await todosAccess.getUploadUrl(userId, todoId);
}