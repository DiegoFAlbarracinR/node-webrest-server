import { envs } from '../src/config/envs';
import { Server } from '../src/presentation/server';

jest.mock( '../src/presentation/server' );

describe( 'Should call server with argument and star', () => {

    test('should work', async() => {

        /*await import('../src/app');
        
        expect( Server ).toHaveBeenCalledTimes(0);
        expect( Server ).toHaveBeenCalledWith({
            port: envs.PORT,
            routes: expect.any(Function),
            public_path: envs.PUBLIC_PATH,
        });

        expect(Server.prototype.start).toHaveBeenCalled();*/

    });

});