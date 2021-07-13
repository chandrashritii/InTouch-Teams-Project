let express = require( 'express' );
let app = express();
let server = require( 'http' ).Server( app );
let io = require( 'socket.io' )( server );
let stream = require( './src/ws/webrtcstream' );
let path = require( 'path' );

let favicon = require( 'serve-favicon' );
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 
  }

var cors = require('cors');

app.use( favicon( path.join( __dirname, '/client/build/favicon.ico' ) ) );
app.use( '/static', express.static( path.join( __dirname, '/client/build/static' ) ) );
app.use( '/assets', express.static( path.join( __dirname, '/client/build' ) ) );

app.use(cors(corsOptions));

io.of( '/stream' ).on( 'connection', stream );

app.get( '*', ( req, res ) => {
    res.sendFile( __dirname + '/client/build/index.html' );
} );

const port = process.env.PORT || 5000;
server.listen( port, () => console.log(`server is running on ${port}`) );