import { CreateTodoDto, TodoEntity, TodoRepository, UpdateTodoDto } from "../../domain";
import { TodoDataSource } from "../../domain/datasources/todo.datasource";

export class TodoRepositoryImp implements TodoRepository {

    constructor(
        private readonly datasource: TodoDataSource,
    ) {}

    create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
        return this.datasource.create( createTodoDto );
    }

    getAll(): Promise<TodoEntity[]> {
        return this.datasource.getAll();
    }

    async findById(id: number): Promise<TodoEntity> {
        const todo = await this.datasource.findById(id);
        if (!todo) {
            throw new Error(`Todo with id ${id} not found`);
        }
        return todo;
    }

    updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
        return this.datasource.updateById( updateTodoDto );
    }

    deleteById(id: number): Promise<TodoEntity> {
        return this.datasource.deleteById( id );
    }

}