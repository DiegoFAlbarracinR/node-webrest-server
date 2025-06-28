import { Request, Response } from 'express';
import { prisma } from '../../data/postgres';
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos';

/*const todos = [
    { id: 1, text: 'Buy milk', createdAt: new Date() },
    { id: 2, text: 'Buy bread', createdAt: null },
    { id: 3, text: 'Buy butter', createdAt: new Date() },
];*/

export class TodosController {
    
    constructor() {}

    public getTodos = async(req: any, res: any) => {
        
        const todos = await prisma.todo.findMany();
        return res.json(todos);

    }

    public getTodoById = async(req: any, res: any) => {
        
        const id = +req.params.id;
        if( isNaN(id) ) return res.status(400).json({ error: `ID argument is not a number` });

        const todo = await prisma.todo.findFirst({
            where: { id }
        });
        //const todo = todos.find( todo => todo.id === id );

        ( todo ) ? 
        res.json( todo ) : 
        res.status(404).json( `TODO with id ${ id } not found` );

    };

    public createTodo = async( req:any, res:any ) => {

        const [error, createTodoDto] = CreateTodoDto.create( req.body );
        if( error ) return res.status(400).json({ error });

        const todo = await prisma.todo.create({
            data: createTodoDto!
        });

        res.json( todo );

    };

    public updateTodo = async( req:any, res:any ) => {

        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDto.create({...req.body, id});
        if ( error ) return res.status(400).json({ error });
        
        const todo = await prisma.todo.findFirst({
            where: { id }
        });

        if( !todo ) return res.status(404).json({ error: `Todo with id ${ id } not found` });

        const updatedTodo = await prisma.todo.update({
            where: { id },
            data: updateTodoDto!.values
        });

        res.json( updatedTodo );

    };

    public deleteTodo = async( req:any, res:any ) => {

         const id = +req.params.id;
        if( isNaN(id) ) return res.status(400).json({ error: `ID argument is not a number` });
        
        const todo = await prisma.todo.findFirst({
            where: { id }
        });
        if( !todo ) return res.status(404).json({ error: `Todo with id ${ id } not found` });
        
        const deletedTodo = await prisma.todo.delete({
            where: { id }
        });

        ( deletedTodo )
        ? res.json( { todo, deletedTodo } )
        : res.status(400).json({ Error: `Todo with id ${ id } not found` });

    }

}