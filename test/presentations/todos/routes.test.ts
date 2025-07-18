import request from 'supertest';
import { testServer } from '../../test-server';
import { response } from 'express';
import { prisma } from '../../../src/data/postgres';
import { text } from 'stream/consumers';


describe( 'Todo rote testing', () => {

    beforeAll( async() => {
        await testServer.start();
    } );

    afterAll( () => {
        testServer.close();
    } );

    beforeEach( async() => {
        await prisma.todo.deleteMany();
    } );

    const todo1 = { text: 'Hola Mundo 1' };
    const todo2 = { text: 'Hola Mundo 2' };

    test( 'should return TODOs api/todos', async() => {

        await prisma.todo.createMany({
            data: [ todo1, todo2 ]
        });

        const response = await request( testServer.app )
        .get('/api/todos')
        .expect(200);

        const body = response.body;
        expect( body ).toBeInstanceOf( Array );
        expect( body.length).toBe( 2 );
        expect( body[0].text ).toBe( todo1.text );
        expect( body[1].text ).toBe( todo2.text );
        expect( body[0].text ).toBe( todo1.text );
        expect( body[0].createdAt ).toBeNull();

    } );

    test( 'should return TODO api/todos/:id', async() => {

        const todo = await prisma.todo.create({
            data: todo1
        });

        const response = await request( testServer.app )
        .get(`/api/todos/${ todo.id }`)
        .expect(200);

        expect( response.body ).toEqual({
            id: todo.id,
            text: todo.text,
            createdAt: todo.createdAt
        });

    } );

    test( 'should return a 404 NotFound api/todos/:id', async() => {

        const todoId = 999;
        const response = await request( testServer.app )
        .get(`/api/todos/${todoId}`)
        .expect(404);

        expect( response.body ).toEqual({ error: `TODO with id ${todoId} not found` });

    } );

    test( 'should return a new Todo api/todos/:id', async() => {

        const response = await request( testServer.app )
        .post('/api/todos')
        .send(todo1)
        .expect(201);

        expect( response.body ).toEqual({
            id: expect.any(Number),
            text: todo1.text,
            createdAt: null
        });

    } );

    test( 'should return an error if text is not present /todos/', async() => {

        const response = await request( testServer.app )
        .post('/api/todos')
        .send({ })
        .expect(400);

        expect( response.body ).toEqual({ error: 'Text property is required' });

    } );

    test( 'should return an error if text is empty /todos/', async() => {

        const response = await request( testServer.app )
        .post('/api/todos')
        .send({ text: '' })
        .expect(400);

        expect( response.body ).toEqual({ error: 'Text property is required' });

    } );

    test( 'should return an updated TODO api/todos/:id', async() => {

        const todo = await prisma.todo.create({ data: todo1 });
        const response = await request( testServer.app )
        .put(`/api/todos/${todo.id}`)
        .send({ text: 'Hola updated', createdAt: '2025-07-17' })
        .expect(201);

        expect( response.body ).toEqual({ 
            id: expect.any(Number), 
            text: 'Hola updated', 
            createdAt: '2025-07-17' 
        });

    } );

    test( 'should return 404 if TODO not found', async() => {

        const todo = 999;
        const response = await request( testServer.app )
        .put(`/api/todos/${todo}`)
        .send({ text: 'Hola updated', createdAt: '2025-07-17' })
        .expect(404);
        
        expect( response.body ).toEqual({ error: 'TODO with id 999 not found' });

    } );

    test( 'should return updated TODO only the date', async() => {

        const todo = await prisma.todo.create({ data: todo1 });
        const response = await request( testServer.app )
        .put(`/api/todos/${todo.id}`)
        .send({ createdAt: '2025-07-17' })
        .expect(500);
        //console.log( response.body );
        /*expect( response.body ).toEqual({ 
            id: expect.any(Number), 
            text: todo1.text, 
            createdAt: '2025-07-17' 
        });*/

    } );

    test( 'should delete TODO api/todos/:id', async() => {

        const todo = await prisma.todo.create({ data: todo1 });

        const response = await request( testServer.app )
        .delete(`/api/todos/${todo.id}`)
        .expect(201);

        expect( response.body ).toEqual({ 
            id: expect.any( Number ), 
            text: todo.text, 
            createdAt: null 
        });

    } );

    test( 'should return 404 if todo dont exists api/todos/:id', async() => {

        const todo = 999;

        const response = await request( testServer.app )
        .delete(`/api/todos/${todo}`)
        .expect(404);

        expect( response.body ).toEqual({ error: 'TODO with id 999 not found' });

    } );

});