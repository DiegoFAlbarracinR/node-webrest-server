import { Request, Response } from 'express';
import { prisma } from '../../data/postgres';
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos';
import { CreatedTodo, CustomError, DeleteTodo, GetTodo, GetTodos, TodoRepository, UpdateTodo } from '../../domain';

/*const todos = [
    { id: 1, text: 'Buy milk', createdAt: new Date() },
    { id: 2, text: 'Buy bread', createdAt: null },
    { id: 3, text: 'Buy butter', createdAt: new Date() },
];*/

export class TodosController {
    
    constructor(
        private readonly todoRepository: TodoRepository,
    ) {}

    private handleError = ( res: Response, error: unknown ) => {
        if ( error instanceof CustomError ){
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Internal server error - check logs' });
    }

    public getTodos = (req: any, res: any) => {
        
        new GetTodos( this.todoRepository )
        .execute()
        .then( todos => res.json( todos ) )
        .catch( error => this.handleError(res, error) );

    }

    public getTodoById = (req: any, res: any) => {
        
        const id = +req.params.id;
        new GetTodo( this.todoRepository )
        .execute( id )
        .then( todo => res.json( todo ) )
        .catch( error => this.handleError(res, error) );

    };

    public createTodo = ( req:any, res:any ) => {

        const [error, createTodoDto] = CreateTodoDto.create( req.body );
        if( error ) return res.status(400).json({ error });

        new CreatedTodo( this.todoRepository )
        .execute( createTodoDto! )
        .then( todo => res.status(201).json( todo ) )
        .catch( error => this.handleError(res, error) );

    };

    public updateTodo = ( req:any, res:any ) => {

        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDto.create({...req.body, id});
        if ( error ) return res.status(400).json({ error });
        
        new UpdateTodo( this.todoRepository )
        .execute( updateTodoDto! )
        .then( todo => res.status(201).json( todo ) )
        .catch( error => this.handleError(res, error) );

    };

    public deleteTodo = ( req:any, res:any ) => {

        const id = +req.params.id;

        new DeleteTodo( this.todoRepository )
        .execute( id! )
        .then( todo => res.status(201).json( todo ) )
        .catch( error => this.handleError(res, error) );

    }

}