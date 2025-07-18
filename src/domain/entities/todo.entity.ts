export class TodoEntity {
    
    constructor(
        public id: number,
        public text: string,
        public createdAt?: Date|null
    ){}

    get isCompleted() {
        return !!this.createdAt;
    }

    public static fromObject( object: {[key: string]: any} ) {

        const { id, text, createdAt } = object;
        if( !id ) throw 'Id is required';
        if( !text ) throw 'texts is required';
        
        let newCreatedAt;
        if( createdAt ) {
            newCreatedAt = new Date( createdAt );
            if( isNaN( newCreatedAt.getTime() ) ) {
                throw 'CreatedAt is not a valid date';
            }
        } 

        return new TodoEntity( id, text, createdAt );

    }

}