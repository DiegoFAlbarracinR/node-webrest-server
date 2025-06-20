import fs from 'fs';
import http from 'http';

const server = http.createServer( (req, res) => {
    console.log(req.url);
    //res.writeHead(200, 'Content-Type: text/html');
    //res.write('<h1>Hola Mundo</h1>');
    //res.end();

    /*const data = {
        name: '',
        age: 30,
        city: ''
    };
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end( JSON.stringify(data) );*/

    const filePath = './public/index.html';
    if (req.url === '/'){
        const htmlFile = fs.readFileSync(filePath,'utf-8');
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end( htmlFile );
        return;
    }

    if( req.url?.endsWith('.js') ) {
        res.writeHead( 200, {'Content-Type': 'application/javascript'} );
    } else if( req.url?.endsWith('.css') ) {
        res.writeHead( 200, {'Content-Type': 'text/css'} );
    }

    const responseContent = fs.readFileSync(`./public${ req.url }`, 'utf-8');
    res.end( responseContent );

});

server.listen( 8080,() => {
    console.log( 'Server runnig on port 8080' );
} );